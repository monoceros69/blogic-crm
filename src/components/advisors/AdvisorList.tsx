import { Link } from 'react-router-dom';
import { type Advisor } from '../../types';

interface AdvisorListProps {
  advisors: Advisor[];
  onEdit: (advisor: Advisor) => void;
  onDelete: (id: string) => void;
}

export function AdvisorList({ advisors, onEdit, onDelete }: AdvisorListProps) {
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
                  Admin
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {advisors.map((advisor) => (
                <tr key={advisor.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <Link
                      to={`/advisors/${advisor.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {advisor.name} {advisor.surname}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {advisor.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {advisor.phone}
                  </td>
                   <td className="px-6 py-4 text-sm text-gray-500">
                    {advisor.isAdmin ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => onEdit(advisor)}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-3 rounded-md w-16 text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => advisor.id && onDelete(advisor.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-md w-16 text-center"
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
          {advisors.map((advisor) => (
            <div key={advisor.id} className="bg-white shadow rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <Link
                    to={`/advisors/${advisor.id}`}
                    className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    {advisor.name} {advisor.surname}
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Email</div>
                  <div>{advisor.email}</div>
                  
                  <div className="text-gray-500">Phone</div>
                  <div>{advisor.phone}</div>

                  <div className="text-gray-500">Admin</div>
                  <div>{advisor.isAdmin ? 'Yes' : 'No'}</div>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => onEdit(advisor)}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-3 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => advisor.id && onDelete(advisor.id)}
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