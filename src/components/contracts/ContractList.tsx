import { Link } from 'react-router-dom';
import { type Contract, type Client, type Advisor } from '../../types';

interface ContractListProps {
  contracts: Contract[];
  clients: Client[];
  advisors: Advisor[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
}

export function ContractList({ contracts, clients, advisors, onEdit, onDelete }: ContractListProps) {
  const getClientName = (clientId: string) => {
    const client = clients.find(c => String(c.id) === clientId);
    return client ? `${client.name} ${client.surname}` : 'Unknown';
  };

  const getAdvisorName = (advisorId: string) => {
    const advisor = advisors.find(a => String(a.id) === advisorId);
    return advisor ? `${advisor.name} ${advisor.surname}` : 'Unknown';
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institution
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Administrator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validity Date
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link
                    to={`/contracts/${contract.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {contract.registrationNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {contract.institution}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link
                    to={`/clients/${contract.clientId}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {getClientName(String(contract.clientId))}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link
                    to={`/advisors/${contract.administratorId}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {getAdvisorName(String(contract.administratorId))}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(contract.validityDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(contract)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => contract.id && onDelete(String(contract.id))}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {contracts.map((contract) => (
            <div key={contract.id} className="p-4 bg-white">
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
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => onEdit(contract)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => contract.id && onDelete(String(contract.id))}
                    className="text-red-600 hover:text-red-900"
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
}