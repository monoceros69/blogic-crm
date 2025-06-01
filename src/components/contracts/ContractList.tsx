import React, { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { type Contract, type Client, type Advisor } from '../../types';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'registrationNumber' | 'institution' | 'clientName' | 'administratorName' | 'assignedAdvisors' | 'validityDate' | null;

interface ContractListProps {
  contracts: Contract[];
  clients: Client[];
  advisors: Advisor[];
  contractAdvisors: { id?: string; contractId: string | number; advisorId: string | number }[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
}

const ContractList: React.FC<ContractListProps> = memo(({ 
  contracts, 
  clients, 
  advisors, 
  contractAdvisors, 
  onEdit, 
  onDelete 
}) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Create lookup maps for better performance
  const clientsMap = useMemo(() => {
    return new Map(clients.map(client => [String(client.id), client]));
  }, [clients]);

  const advisorsMap = useMemo(() => {
    return new Map(advisors.map(advisor => [String(advisor.id), advisor]));
  }, [advisors]);

  // Group contract advisors by contract ID for faster lookup
  const contractAdvisorsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    contractAdvisors.forEach(ca => {
      const contractId = String(ca.contractId);
      if (!map.has(contractId)) {
        map.set(contractId, []);
      }
      map.get(contractId)!.push(String(ca.advisorId));
    });
    return map;
  }, [contractAdvisors]);

  const sortedContracts = useMemo(() => {
    if (!sortField || !sortDirection) {
      return contracts;
    }

    return [...contracts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'registrationNumber':
          aValue = a.registrationNumber;
          bValue = b.registrationNumber;
          break;
        case 'institution':
          aValue = a.institution;
          bValue = b.institution;
          break;
        case 'clientName': {
          const aClient = clientsMap.get(String(a.clientId));
          const bClient = clientsMap.get(String(b.clientId));
          aValue = aClient ? `${aClient.name} ${aClient.surname}` : '';
          bValue = bClient ? `${bClient.name} ${bClient.surname}` : '';
          break;
        }
        case 'administratorName': {
          const aAdmin = advisorsMap.get(String(a.administratorId));
          const bAdmin = advisorsMap.get(String(b.administratorId));
          aValue = aAdmin ? `${aAdmin.name} ${aAdmin.surname}` : '';
          bValue = bAdmin ? `${bAdmin.name} ${bAdmin.surname}` : '';
          break;
        }
        case 'assignedAdvisors': {
          const aAdvisorIds = contractAdvisorsMap.get(String(a.id)) || [];
          const bAdvisorIds = contractAdvisorsMap.get(String(b.id)) || [];
          
          const aAdvisors = aAdvisorIds
            .map(id => advisorsMap.get(id))
            .filter(Boolean)
            .map(adv => `${adv!.name} ${adv!.surname}`)
            .join(', ');
          
          const bAdvisors = bAdvisorIds
            .map(id => advisorsMap.get(id))
            .filter(Boolean)
            .map(adv => `${adv!.name} ${adv!.surname}`)
            .join(', ');
          
          aValue = aAdvisors;
          bValue = bAdvisors;
          break;
        }
        case 'validityDate':
          aValue = new Date(a.validityDate).getTime();
          bValue = new Date(b.validityDate).getTime();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [contracts, clientsMap, advisorsMap, contractAdvisorsMap, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="text-gray-400"><FaSort /></div>;
    return sortDirection === 'asc' ? <div className="text-blue-500"><FaSortUp /></div> : <div className="text-blue-500"><FaSortDown /></div>;
  };

  const getClientName = (clientId: string) => {
    const client = clientsMap.get(clientId);
    return client ? `${client.name} ${client.surname}` : 'Unknown';
  };

  const getAdvisorName = (advisorId: string) => {
    const advisor = advisorsMap.get(advisorId);
    return advisor ? `${advisor.name} ${advisor.surname}` : 'Unknown';
  };

  const getAssignedAdvisors = (contractId: string) => {
    const advisorIds = contractAdvisorsMap.get(contractId) || [];
    return advisorIds
      .map(id => {
        const advisor = advisorsMap.get(id);
        return advisor ? {
          id,
          name: `${advisor.name} ${advisor.surname}`
        } : null;
      })
      .filter(Boolean) as { id: string; name: string }[];
  };

  // Memoize isAdmin check
  const isAdmin = useMemo(() => localStorage.getItem('isAdmin') === 'true', []);

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50 min-w-[1200px]">
              <tr>
                <th 
                  scope="col" 
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100 w-36"
                  onClick={() => handleSort('registrationNumber')}
                >
                  <div className="flex items-center gap-1">
                    Registration Number
                    {getSortIcon('registrationNumber')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('institution')}
                >
                  <div className="flex items-center gap-1">
                    Institution
                    {getSortIcon('institution')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('clientName')}
                >
                  <div className="flex items-center gap-1">
                    Client
                    {getSortIcon('clientName')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('assignedAdvisors')}
                >
                  <div className="flex items-center gap-1">
                    Assigned Advisors
                    {getSortIcon('assignedAdvisors')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('administratorName')}
                >
                  <div className="flex items-center gap-1">
                    Administrator
                    {getSortIcon('administratorName')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('validityDate')}
                >
                  <div className="flex items-center gap-1">
                    Validity Date
                    {getSortIcon('validityDate')}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedContracts.map((contract) => (
                <tr key={contract.id} className="align-middle">
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">
                    <Link
                      to={`/contracts/${contract.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {contract.registrationNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contract.institution}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Link
                      to={`/clients/${contract.clientId}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {getClientName(String(contract.clientId))}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {
                      getAssignedAdvisors(String(contract.id)).map((advisor, index, array) => (
                        <React.Fragment key={advisor.id}>
                          <Link
                            to={`/advisors/${advisor.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {advisor.name}
                          </Link>
                          {index < array.length - 1 && ', '}
                        </React.Fragment>
                      ))
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Link
                      to={`/advisors/${contract.administratorId}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {getAdvisorName(String(contract.administratorId))}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 align-middle">
                    {new Date(contract.validityDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex flex-col items-end space-y-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(contract)}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-3 rounded-md w-full text-center"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => contract.id && onDelete(String(contract.id))}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-md w-full text-center"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - similar optimizations */}
      <div className="md:hidden">
        <div className="space-y-4">
          {sortedContracts.map((contract) => (
            <div key={contract.id} className="bg-white shadow rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <Link
                    to={`/contracts/${contract.id}`}
                    className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    {contract.registrationNumber}
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Institution</div>
                  <div>{contract.institution}</div>
                  
                  <div className="text-gray-500">Client</div>
                  <div>
                    <Link
                      to={`/clients/${contract.clientId}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {getClientName(String(contract.clientId))}
                    </Link>
                  </div>
                  
                  <div className="text-gray-500">Administrator</div>
                  <div>
                    <Link
                      to={`/advisors/${contract.administratorId}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {getAdvisorName(String(contract.administratorId))}
                    </Link>
                  </div>
                  
                  <div className="text-gray-500">Assigned Advisors</div>
                  <div className="break-words">
                    {
                      getAssignedAdvisors(String(contract.id)).map((advisor, index, array) => (
                        <React.Fragment key={advisor.id}>
                          <Link
                            to={`/advisors/${advisor.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {advisor.name}
                          </Link>
                          {index < array.length - 1 && ', '}
                        </React.Fragment>
                      ))
                    }
                  </div>
                  
                  <div className="text-gray-500">Validity Date</div>
                  <div>{new Date(contract.validityDate).toLocaleDateString()}</div>
                </div>
                <div className="flex -mx-4 -mb-4 mt-4 border-t border-gray-200">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEdit(contract)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 w-1/2 text-center rounded-bl-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => contract.id && onDelete(String(contract.id))}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 w-1/2 text-center rounded-br-lg"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ContractList.displayName = 'ContractList';

export default ContractList;