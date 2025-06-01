import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { type Contract, type Client, type Advisor } from '../../types';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'registrationNumber' | 'institution' | 'clientName' | 'advisorName' | 'administratorName' | 'validityDate' | null;

interface ContractListProps {
  contracts: Contract[];
  clients: Client[];
  advisors: Advisor[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, clients, advisors, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [sortedContracts, setSortedContracts] = useState<Contract[]>(contracts);

  useEffect(() => {
    if (!sortField || !sortDirection) {
      setSortedContracts(contracts);
      return;
    }

    const sorted = [...contracts].sort((a, b) => {
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
        case 'clientName':
          aValue = clients.find(c => c.id === a.clientId)?.name || '';
          bValue = clients.find(c => c.id === b.clientId)?.name || '';
          break;
        case 'advisorName':
          const aAdvisor = advisors.find(adv => adv.id === a.administratorId);
          const bAdvisor = advisors.find(adv => adv.id === b.administratorId);
          aValue = aAdvisor?.name || '';
          bValue = bAdvisor?.name || '';
          break;
        case 'administratorName':
          const aAdmin = advisors.find(adv => String(adv.id) === String(a.administratorId));
          const bAdmin = advisors.find(adv => String(adv.id) === String(b.administratorId));
          aValue = aAdmin?.name || '';
          bValue = bAdmin?.name || '';
          break;
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

    setSortedContracts(sorted);
  }, [contracts, clients, advisors, sortField, sortDirection]);

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
    const client = clients.find(c => String(c.id) === clientId);
    return client ? `${client.name} ${client.surname}` : 'Unknown';
  };

  const getAdvisorName = (advisorId: string) => {
    const advisor = advisors.find(a => String(a.id) === advisorId);
    return advisor ? `${advisor.name} ${advisor.surname}` : 'Unknown';
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('registrationNumber')}
                >
                  <div className="flex items-center gap-1">
                    Registration Number
                    {getSortIcon('registrationNumber')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('institution')}
                >
                  <div className="flex items-center gap-1">
                    Institution
                    {getSortIcon('institution')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('clientName')}
                >
                  <div className="flex items-center gap-1">
                    Client
                    {getSortIcon('clientName')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('administratorName')}
                >
                  <div className="flex items-center gap-1">
                    Administrator
                    {getSortIcon('administratorName')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                <tr key={contract.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
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
                    <Link
                      to={`/advisors/${contract.administratorId}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {getAdvisorName(String(contract.administratorId))}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(contract.validityDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex flex-col items-end space-y-2">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
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
                  
                  <div className="text-gray-500">Validity Date</div>
                  <div>{new Date(contract.validityDate).toLocaleDateString()}</div>
                </div>
                <div className="flex -mx-4 -mb-4 mt-4 border-t border-gray-200">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractList;