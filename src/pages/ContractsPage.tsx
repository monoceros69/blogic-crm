import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ContractList from '../components/contracts/ContractList';
import { ContractForm } from '../components/contracts/ContractForm';
import { contractsApi, clientsApi, advisorsApi, contractAdvisorsApi } from '../services/api';
import { type Contract, type Client, type Advisor } from '../types';
import { type ContractFormData } from '../schemas';
import { arrayToCsv, downloadCsv } from '../utils/export';

export function ContractsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | undefined>();
  const [editingAdvisorIds, setEditingAdvisorIds] = useState<string[]>([]);

  // State for filters
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedAdvisors, setSelectedAdvisors] = useState<string[]>([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const { data: contracts = [], isLoading: contractsLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const response = await contractsApi.getAll();
      return response.data;
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.getAll();
      return response.data;
    },
  });

  const { data: advisors = [] } = useQuery({
    queryKey: ['advisors'],
    queryFn: async () => {
      const response = await advisorsApi.getAll();
      return response.data;
    },
  });

  const { data: contractAdvisors = [] } = useQuery({
    queryKey: ['contractAdvisors'],
    queryFn: async () => {
      const response = await contractAdvisorsApi.getAll();
      return response.data;
    },
  });

  const createContractMutation = useMutation({
    mutationFn: async ({ contract, advisorIds }: { contract: ContractFormData; advisorIds: string[] }) => {
      // Check for duplicate registration number
      const existingContractWithSameNumber = contracts.find(
        (c) => c.registrationNumber === contract.registrationNumber
      );
      if (existingContractWithSameNumber) {
        throw new Error('Contract with this registration number already exists.');
      }

      // Create the contract
      const contractResponse = await contractsApi.create(contract);
      const newContract = contractResponse.data;

      // Create contract-advisor relationships
      await Promise.all(
        advisorIds.map(advisorId =>
          contractAdvisorsApi.create({
            contractId: newContract.id!,
            advisorId,
          })
        )
      );

      return newContract;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contractAdvisors'] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const updateContractMutation = useMutation({
    mutationFn: async ({
      id,
      contract,
      advisorIds
    }: {
      id: string;
      contract: ContractFormData;
      advisorIds: string[];
    }) => {
      // Check for duplicate registration number on other contracts
      const existingContractWithSameNumber = contracts.find(
        (c) => c.registrationNumber === contract.registrationNumber && c.id !== id
      );
      if (existingContractWithSameNumber) {
        throw new Error('Contract with this registration number already exists.');
      }

      // Update the contract
      await contractsApi.update(id, contract);

      // Get existing advisor relationships
      const existingRelations = contractAdvisors.filter(ca => ca.contractId === id);
      const existingAdvisorIds = existingRelations.map(ca => String(ca.advisorId));

      // Determine which to add and remove
      const toAdd = advisorIds.filter(id => !existingAdvisorIds.includes(id));
      const toRemove = existingRelations.filter(ca => !advisorIds.includes(String(ca.advisorId)));

      // Remove old relationships
      await Promise.all(
        toRemove.map(ca => contractAdvisorsApi.delete(ca.id!))
      );

      // Add new relationships
      await Promise.all(
        toAdd.map(advisorId =>
          contractAdvisorsApi.create({
            contractId: id,
            advisorId,
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contractAdvisors'] });
      setIsFormOpen(false);
      setEditingContract(undefined);
      setEditingAdvisorIds([]);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const deleteContractMutation = useMutation({
    mutationFn: async (id: string) => {
      // Delete all contract-advisor relationships first
      const relations = contractAdvisors.filter(ca => ca.contractId === id);
      await Promise.all(
        relations.map(ca => contractAdvisorsApi.delete(ca.id!))
      );

      // Then delete the contract
      await contractsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contractAdvisors'] });
    },
  });

  const handleSubmit = (data: ContractFormData, advisorIds: string[]) => {
    if (editingContract?.id) {
      updateContractMutation.mutate({
        id: editingContract.id,
        contract: data,
        advisorIds
      });
    } else {
      createContractMutation.mutate({ contract: data, advisorIds });
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    // Get advisor IDs for this contract
    const advisorIds = contractAdvisors
      .filter(ca => ca.contractId === contract.id)
      .map(ca => String(ca.advisorId));
    setEditingAdvisorIds(advisorIds);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract? This will also remove all advisor associations.')) {
      deleteContractMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingContract(undefined);
    setEditingAdvisorIds([]);
  };

  // Filter logic
  const filteredContracts = contracts.filter(contract => {
    const institutionMatch = selectedInstitutions.length === 0 || selectedInstitutions.includes(contract.institution);
    const clientMatch = selectedClients.length === 0 || selectedClients.includes(String(contract.clientId));
    const advisorMatch = selectedAdvisors.length === 0 ||
      contractAdvisors.some(ca =>
        ca.contractId === contract.id && selectedAdvisors.includes(String(ca.advisorId))
      );
    return institutionMatch && clientMatch && advisorMatch;
  });

  const handleExportAllCsv = async () => {
    // Use the data from react-query hooks
    const allContracts: Contract[] = contracts;
    const allClients: Client[] = clients;
    const allAdvisors: Advisor[] = advisors;

    // Prepare and Export Contracts
    const contractFields = [
      { key: 'registrationNumber', label: 'Registration Number' },
      { key: 'institution', label: 'Institution' },
      { key: 'clientId', label: 'Client ID' },
      { key: 'clientName', label: 'Client Name' },
      { key: 'administratorId', label: 'Administrator ID' },
      { key: 'administratorName', label: 'Administrator Name' },
      { key: 'validityDate', label: 'Validity Date' },
      { key: 'conclusionDate', label: 'Conclusion Date' },
      { key: 'endingDate', label: 'Ending Date' },
    ] as { key: keyof (Contract & { clientName: string; administratorName: string }), label: string }[];

    const contractsWithNames = allContracts.map(contract => {
      const client = allClients.find(c => String(c.id) === String(contract.clientId));
      const administrator = allAdvisors.find(a => String(a.id) === String(contract.administratorId));
      return {
        ...contract,
        clientId: String(contract.clientId),
        clientName: client ? `${client.name} ${client.surname}` : 'Unknown',
        administratorId: String(contract.administratorId),
        administratorName: administrator ? `${administrator.name} ${administrator.surname}` : 'Unknown'
      };
    });
    const contractsCsv = arrayToCsv(contractsWithNames, contractFields);

    // Prepare and Export Clients
    const clientFields: { key: keyof Client, label: string }[] = [
      { key: 'name', label: 'First Name' },
      { key: 'surname', label: 'Surname' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'age', label: 'Age' },
    ];
    const clientsCsv = arrayToCsv(allClients, clientFields);

    // Prepare and Export Advisors
    const advisorFields: { key: keyof Advisor, label: string }[] = [
      { key: 'name', label: 'First Name' },
      { key: 'surname', label: 'Surname' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'isAdmin', label: 'Is Admin' },
    ];
    const advisorsCsv = arrayToCsv(allAdvisors, advisorFields);

    // Combine and download
    const combinedCsv = 'Contracts\n' + contractsCsv + '\n\nClients\n' + clientsCsv + '\n\nAdvisors\n' + advisorsCsv;
    downloadCsv(combinedCsv, 'all_crm_data.csv');
  };

  if (contractsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading contracts...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Contracts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all contracts in the system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
          >
            Add Contract
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mt-6 relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          >
            Filter
            {/* Dropdown arrow */}
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Filter Dropdown */}
        {isFilterDropdownOpen && (
          <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {/* Institution Filter */}
              <div className="px-4 py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                <div className="space-y-2">
                  {['ČSOB', 'AEGON', 'Axa', 'Other'].map(institution => (
                    <div key={institution} className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`institution-${institution}`}
                          name="institution-filter"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          value={institution}
                          checked={selectedInstitutions.includes(institution)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInstitutions([...selectedInstitutions, institution]);
                            } else {
                              setSelectedInstitutions(selectedInstitutions.filter(item => item !== institution));
                            }
                          }}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`institution-${institution}`} className="font-medium text-gray-700">{institution}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Filter */}
              <div className="px-4 py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {clients.map(client => (
                    <div key={client.id} className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`client-${client.id}`}
                          name="client-filter"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          value={client.id}
                          checked={selectedClients.includes(String(client.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedClients([...selectedClients, String(client.id)]);
                            } else {
                              setSelectedClients(selectedClients.filter(id => id !== String(client.id)));
                            }
                          }}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`client-${client.id}`} className="font-medium text-gray-700">{client.name} {client.surname}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advisor Filter */}
              <div className="px-4 py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Advisor</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {advisors.map(advisor => (
                    <div key={advisor.id} className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`advisor-${advisor.id}`}
                          name="advisor-filter"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          value={advisor.id}
                          checked={selectedAdvisors.includes(String(advisor.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAdvisors([...selectedAdvisors, String(advisor.id)]);
                            } else {
                              setSelectedAdvisors(selectedAdvisors.filter(id => id !== String(advisor.id)));
                            }
                          }}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`advisor-${advisor.id}`} className="font-medium text-gray-700">{advisor.name} {advisor.surname}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingContract ? 'Edit Contract' : 'New Contract'}
            </h3>
            <ContractForm
              contract={editingContract}
              clients={clients}
              advisors={advisors}
              selectedAdvisors={editingAdvisorIds}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <ContractList
          contracts={filteredContracts}
          clients={clients}
          advisors={advisors}
          contractAdvisors={contractAdvisors}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Export Buttons Container */}
      <div className="mt-8 flex justify-between items-center">
        {/* Export Contracts Button */}
        <div>
          <button
            onClick={() => {
              // Create a new array with both IDs and names
              const contractsWithNames = filteredContracts.map(contract => {
                const client = clients.find(c => String(c.id) === String(contract.clientId));
                const administrator = advisors.find(a => String(a.id) === String(contract.administratorId));
                return {
                  ...contract,
                  clientId: String(contract.clientId),
                  clientName: client ? `${client.name} ${client.surname}` : 'Unknown',
                  administratorId: String(contract.administratorId),
                  administratorName: administrator ? `${administrator.name} ${administrator.surname}` : 'Unknown'
                };
              });

              type ContractWithNames = typeof contractsWithNames[0];
              const fields: { key: keyof ContractWithNames, label: string }[] = [
                { key: 'registrationNumber', label: 'Registration Number' },
                { key: 'institution', label: 'Institution' },
                { key: 'clientId', label: 'Client ID' },
                { key: 'clientName', label: 'Client Name' },
                { key: 'administratorId', label: 'Administrator ID' },
                { key: 'administratorName', label: 'Administrator Name' },
                { key: 'validityDate', label: 'Validity Date' },
                { key: 'conclusionDate', label: 'Conclusion Date' },
                { key: 'endingDate', label: 'Ending Date' },
              ];

              const csvString = arrayToCsv(contractsWithNames, fields);
              downloadCsv(csvString, 'contracts.csv');
            }}
            className="inline-flex items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            Export Contracts CSV
          </button>
        </div>

        {/* Export All Data Button */}
        <div>
          <button
            onClick={handleExportAllCsv}
            className="inline-flex items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            Export All Data CSV
          </button>
        </div>
      </div>
    </div>
  );
}