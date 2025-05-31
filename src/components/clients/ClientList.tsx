import { Link } from 'react-router-dom';
import { type Client } from '../../types';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <Link
                      to={`/clients/${client.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {client.name} {client.surname}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {client.age}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                     <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => onEdit(client)}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-3 rounded-md w-24 text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => client.id && onDelete(client.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-md w-24 text-center"
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
          {clients.map((client) => (
            <div key={client.id} className="bg-white shadow rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <Link
                    to={`/clients/${client.id}`}
                    className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    {client.name} {client.surname}
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Email</div>
                  <div className="break-words">{client.email}</div>
                  
                  <div className="text-gray-500">Phone</div>
                  <div className="break-words">{client.phone}</div>

                  <div className="text-gray-500">Age</div>
                  <div className="break-words">{client.age}</div>
                </div>
                <div className="flex -mx-4 -mb-4 mt-4border-t border-gray-200">
                  <button
                    onClick={() => onEdit(client)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 w-1/2 text-center rounded-bl-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => client.id && onDelete(client.id)}
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
}
