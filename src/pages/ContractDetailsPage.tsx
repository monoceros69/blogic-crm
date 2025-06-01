import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contractsApi, clientsApi, advisorsApi, contractAdvisorsApi } from '../services/api';

function ContractDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const contractId = id || '';

  const { data: contract, isLoading: contractLoading } = useQuery({
    queryKey: ['contracts', contractId],
    queryFn: async () => {
      const response = await contractsApi.getById(contractId);
      return response.data;
    },
    enabled: !!contractId,
  });

  const { data: client } = useQuery({
    queryKey: ['clients', contract?.clientId],
    queryFn: async () => {
      const response = await clientsApi.getById(String(contract!.clientId));
      return response.data;
    },
    enabled: !!contract?.clientId,
  });

  const { data: administrator } = useQuery({
    queryKey: ['advisors', contract?.administratorId],
    queryFn: async () => {
      const response = await advisorsApi.getById(String(contract!.administratorId));
      return response.data;
    },
    enabled: !!contract?.administratorId,
  });

  const { data: contractAdvisors = [] } = useQuery({
    queryKey: ['contractAdvisors', contractId],
    queryFn: async () => {
      const response = await contractAdvisorsApi.getByContractId(contractId);
      return response.data;
    },
    enabled: !!contractId,
  });

  const { data: advisors = [] } = useQuery({
    queryKey: ['advisors'],
    queryFn: async () => {
      const response = await advisorsApi.getAll();
      return response.data;
    },
  });

  const contractAdvisorsList = contractAdvisors
    .map(ca => advisors.find(a => a.id === String(ca.advisorId)))
    .filter(Boolean);

  if (contractLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading contract details...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Contract not found</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          to="/contracts"
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          ← Back to Contracts
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contract Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Contract details and associated parties.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {contract.registrationNumber}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Institution</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {contract.institution}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Client</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client ? (
                  <Link
                    to={`/clients/${client.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {client.name} {client.surname}
                  </Link>
                ) : (
                  'Loading...'
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Administrator</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {administrator ? (
                  <Link
                    to={`/advisors/${administrator.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {administrator.name} {administrator.surname}
                  </Link>
                ) : (
                  'Loading...'
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Conclusion Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(contract.conclusionDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Validity Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(contract.validityDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Ending Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(contract.endingDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Advisors</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="space-y-1">
                  {contractAdvisorsList.map((advisor) => (
                    <li key={advisor!.id}>
                      <Link
                        to={`/advisors/${advisor!.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {advisor!.name} {advisor!.surname}
                      </Link>
                      {advisor!.isAdmin && (
                        <span className="ml-2 inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                          Admin
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
export default ContractDetailsPage;