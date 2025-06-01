import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdvisorList from '../components/advisors/AdvisorList';
import { AdvisorForm } from '../components/advisors/AdvisorForm';
import { advisorsApi } from '../services/api';
import { type Advisor } from '../types';
import { type AdvisorFormData } from '../schemas';

export function AdvisorsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | undefined>();

  const { data: advisors = [], isLoading, error } = useQuery({
    queryKey: ['advisors'],
    queryFn: async () => {
      const response = await advisorsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AdvisorFormData) => advisorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisors'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdvisorFormData }) =>
      advisorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisors'] });
      setIsFormOpen(false);
      setEditingAdvisor(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => advisorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisors'] });
    },
  });

  const handleSubmit = (data: AdvisorFormData) => {
    if (editingAdvisor?.id) {
      updateMutation.mutate({ id: editingAdvisor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (advisor: Advisor) => {
    setEditingAdvisor(advisor);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this advisor?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingAdvisor(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading advisors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading advisors</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Advisors</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all advisors and administrators in the system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-40"
            hidden={localStorage.getItem('isAdmin') !== 'true'}
          >
            Add Advisor
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingAdvisor ? 'Edit Advisor' : 'New Advisor'}
            </h3>
            <AdvisorForm
              advisor={editingAdvisor}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <AdvisorList
          advisors={advisors}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}