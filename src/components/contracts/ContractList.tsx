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
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="w-full divide-y divide-gray-300">
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
          {contracts.map((contract) => (
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
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => onEdit(contract)}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-3 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => contract.id && onDelete(String(contract.id))}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-md"
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