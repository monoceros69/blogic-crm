import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { type Client } from '../../types';
import { arrayToCsv, downloadCsv } from '../../utils/export';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'email' | 'phone' | 'age' | 'ssn' | null;

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [sortedClients, setSortedClients] = useState<Client[]>(clients);

  useEffect(() => {
    if (!sortField || !sortDirection) {
      setSortedClients(clients);
      return;
    }

    const sorted = [...clients].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = `${a.name} ${a.surname}`;
          bValue = `${b.name} ${b.surname}`;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'phone':
          aValue = a.phone;
          bValue = b.phone;
          break;
        case 'age':
          aValue = a.age;
          bValue = b.age;
          break;
        case 'ssn':
          aValue = a.ssn;
          bValue = b.ssn;
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

    setSortedClients(sorted);
  }, [clients, sortField, sortDirection]);

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

  const handleExportCsv = () => {
    const fields: { key: keyof Client, label: string }[] = [
      { key: 'name', label: 'First Name' },
      { key: 'surname', label: 'Surname' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'age', label: 'Age' },
      { key: 'ssn', label: 'SSN' },
    ];

    const csvString = arrayToCsv(sortedClients, fields);
    downloadCsv(csvString, 'clients.csv');
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="w-56 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="w-72 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email
                    {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="w-48 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center gap-1">
                    Phone
                    {getSortIcon('phone')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="w-32 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('age')}
                >
                  <div className="flex items-center gap-1">
                    Age
                    {getSortIcon('age')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="w-48 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase select-none tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ssn')}
                >
                  <div className="flex items-center gap-1">
                    SSN
                    {getSortIcon('ssn')}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedClients.map((client) => (
                <tr key={client.id} className="align-middle">
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
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {client.ssn}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium align-middle">
                     <div className="flex flex-col items-end space-y-2">
                      {localStorage.getItem('isAdmin') === 'true' && (
                        <>
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

                  <div className="text-gray-500">SSN</div>
                  <div className="break-words">{client.ssn}</div>
                </div>
                <div className="flex -mx-4 -mb-4 mt-4border-t border-gray-200">
                  {localStorage.getItem('isAdmin') === 'true' && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-4">
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        >
          Export Clients CSV
        </button>
      </div>
    </div>
  );
};

export default ClientList;
