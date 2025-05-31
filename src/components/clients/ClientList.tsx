import { Link } from 'react-router-dom';
import { type Client } from '../../types';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

export function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  return (
	<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
	  <table className="min-w-full divide-y divide-gray-300">
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
			  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
				<Link
				  to={`/clients/${client.id}`}
				  className="text-indigo-600 hover:text-indigo-900"
				>
				  {client.name} {client.surname}
				</Link>
			  </td>
			  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{client.email}
			  </td>
			  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{client.phone}
			  </td>
			  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{client.age}
			  </td>
			  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
				<button
				  onClick={() => onEdit(client)}
				  className="text-indigo-600 hover:text-indigo-900 mr-4"
				>
				  Edit
				</button>
				<button
				  onClick={() => client.id && onDelete(client.id)}
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
  );
}
