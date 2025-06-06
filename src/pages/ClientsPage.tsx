import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ClientList from '../components/clients/ClientList';
import { PersonForm } from '../components/PersonForm';
import { clientsApi } from '../services/api';
import { type Client } from '../types';
import { type PersonFormData } from '../schemas';

function ClientsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: PersonFormData) => clientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsFormOpen(false);
      setHasUnsavedChanges(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PersonFormData }) =>
      clientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsFormOpen(false);
      setEditingClient(undefined);
      setHasUnsavedChanges(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleSubmit = (data: PersonFormData) => {
    if (editingClient?.id) {
      updateMutation.mutate({ id: editingClient.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (client: Client) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Do you want to discard them and edit a different client?')) {
        setEditingClient(client);
        setHasUnsavedChanges(false);
        setIsFormOpen(true);
      }
    } else {
      setEditingClient(client);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Do you want to discard them?')) {
        setIsFormOpen(false);
        setEditingClient(undefined);
        setHasUnsavedChanges(false);
      }
    } else {
      setIsFormOpen(false);
      setEditingClient(undefined);
    }
  };

  const handleFormChange = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading clients</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all clients in the system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
            hidden={localStorage.getItem('isAdmin') !== 'true'}
          >
            Add Client
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingClient ? 'Edit Client' : 'New Client'}
            </h3>
            <PersonForm
              person={editingClient}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onFormChange={handleFormChange}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <ClientList
          clients={clients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
export default ClientsPage;