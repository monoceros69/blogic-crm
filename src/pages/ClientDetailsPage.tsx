import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '../services/api';

export function ClientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const clientId =  id || '';

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['clients', clientId],
    queryFn: async () => {
      const response = await clientsApi.getById(clientId);
      return response.data;
    },
    enabled: !!clientId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading client details...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading client details</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          to="/clients"
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          ← Back to Clients
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Client Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and contact information.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.name} {client.surname}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.phone}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">SSN</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.ssn}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.age} years
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}