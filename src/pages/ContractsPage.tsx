import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractList } from '../components/contracts/ContractList';
import { ContractForm } from '../components/contracts/ContractForm';
import { contractsApi, clientsApi, advisorsApi, contractAdvisorsApi } from '../services/api';
import { type Contract } from '../types';
import { type ContractFormData } from '../schemas';

export function ContractsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | undefined>();
  const [editingAdvisorIds, setEditingAdvisorIds] = useState<number[]>([]);

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
    mutationFn: async ({ contract, advisorIds }: { contract: ContractFormData; advisorIds: number[] }) => {
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
  });

  const updateContractMutation = useMutation({
    mutationFn: async ({ 
      id, 
      contract, 
      advisorIds 
    }: { 
      id: number; 
      contract: ContractFormData; 
      advisorIds: number[] 
    }) => {
      // Update the contract
      await contractsApi.update(id, contract);

      // Get existing advisor relationships
      const existingRelations = contractAdvisors.filter(ca => ca.contractId === id);
      const existingAdvisorIds = existingRelations.map(ca => ca.advisorId);

      // Determine which to add and remove
      const toAdd = advisorIds.filter(id => !existingAdvisorIds.includes(id));
      const toRemove = existingRelations.filter(ca => !advisorIds.includes(ca.advisorId));

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
  });

  const deleteContractMutation = useMutation({
    mutationFn: async (id: number) => {
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

  const handleSubmit = (data: ContractFormData, advisorIds: number[]) => {
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
      .map(ca => ca.advisorId);
    setEditingAdvisorIds(advisorIds);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this contract? This will also remove all advisor associations.')) {
      deleteContractMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingContract(undefined);
    setEditingAdvisorIds([]);
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
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Contract
          </button>
        </div>
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
          contracts={contracts}
          clients={clients}
          advisors={advisors}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}