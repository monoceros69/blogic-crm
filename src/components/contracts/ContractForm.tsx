import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { type Contract, type Client, type Advisor } from '../../types';
import { contractSchema, type ContractFormData } from '../../schemas';

interface ContractFormProps {
  contract?: Contract;
  clients: Client[];
  advisors: Advisor[];
  selectedAdvisors?: string[];
  onSubmit: (data: ContractFormData, advisorIds: string[]) => void;
  onCancel: () => void;
  onFormChange: (hasChanges: boolean) => void;
}

export function ContractForm({
  contract,
  clients,
  advisors,
  selectedAdvisors = [],
  onSubmit,
  onCancel,
  onFormChange
}: ContractFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [advisorIds, setAdvisorIds] = useState<string[]>(
    selectedAdvisors.length > 0 ? selectedAdvisors : []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(contractSchema),
    defaultValues: contract ? {
      registrationNumber: contract.registrationNumber,
      institution: contract.institution as 'ČSOB' | 'AEGON' | 'Axa' | 'Other',
      clientId: String(contract.clientId),
      administratorId: String(contract.administratorId),
      conclusionDate: contract.conclusionDate,
      validityDate: contract.validityDate,
      endingDate: contract.endingDate,
    } : {
      registrationNumber: '',
      institution: 'ČSOB' as 'ČSOB' | 'AEGON' | 'Axa' | 'Other',
      clientId: '',
      administratorId: '',
      conclusionDate: '',
      validityDate: '',
      endingDate: '',
    },
  });

  const administratorId = watch('administratorId');

  // Ensure administrator is in advisors list
  useEffect(() => {
    if (administratorId && !advisorIds.includes(administratorId)) {
      setAdvisorIds([...advisorIds, administratorId]);
    }
  }, [administratorId, advisorIds]); // Added advisorIds to dependency array

  // Initialize advisorIds state when contract prop changes (for editing)
  useEffect(() => {
    if (contract && selectedAdvisors.length > 0) {
      setAdvisorIds(selectedAdvisors);
    } else if (!contract) {
      // Clear advisors when adding a new contract
      setAdvisorIds([]);
    }
  }, [contract, selectedAdvisors]);

  // Handle advisor checkbox toggle
  const handleAdvisorToggle = (advisorId: string) => {
    if (advisorId === administratorId) {
      alert('Cannot remove the administrator from advisors');
      return;
    }

    setAdvisorIds(prev =>
      prev.includes(advisorId)
        ? prev.filter(id => id !== advisorId)
        : [...prev, advisorId]
    );
  };

  const onFormSubmit = (data: ContractFormData) => {
    if (advisorIds.length === 0) {
      alert('Please select at least one advisor');
      return;
    }
    onSubmit(data, advisorIds);
  };

  // Scroll form into view when the contract prop changes or form is initially rendered
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [contract]);

  // Watch form fields for changes and notify parent component
  useEffect(() => {
    const subscription = watch(() => {
      onFormChange(isDirty);
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty, onFormChange]);

  // Reset form when the contract prop changes (for editing)
  useEffect(() => {
    if (contract) {
      // Ensure default values are set based on contract for reset
      reset({
        registrationNumber: contract.registrationNumber,
        institution: contract.institution as 'ČSOB' | 'AEGON' | 'Axa' | 'Other',
        clientId: String(contract.clientId),
        administratorId: String(contract.administratorId),
        conclusionDate: contract.conclusionDate,
        validityDate: contract.validityDate,
        endingDate: contract.endingDate,
      });
    } else {
      // Reset to empty when creating a new contract
      reset({
        registrationNumber: '',
        institution: 'ČSOB' as 'ČSOB' | 'AEGON' | 'Axa' | 'Other',
        clientId: '',
        administratorId: '',
        conclusionDate: '',
        validityDate: '',
        endingDate: '',
      });
    }
  }, [contract, reset]);

  // Watch advisorIds state for changes and notify parent component
  useEffect(() => {
    const initialAdvisorIds = contract ? selectedAdvisors : [];
    const hasAdvisorChanges = JSON.stringify(advisorIds.sort()) !== JSON.stringify(initialAdvisorIds.sort());
    
    // Combine form field dirtiness with advisor changes
    onFormChange(isDirty || hasAdvisorChanges);
  }, [advisorIds, isDirty, onFormChange, contract, selectedAdvisors]);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            type="text"
            id="registrationNumber"
            {...register('registrationNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.registrationNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
            Institution
          </label>
          <select
            id="institution"
            {...register('institution')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          >
            <option value="ČSOB">ČSOB</option>
            <option value="AEGON">AEGON</option>
            <option value="Axa">Axa</option>
            <option value="Other">Other</option>
          </select>
          {errors.institution && (
            <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <select
            id="clientId"
            {...register('clientId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={String(client.id)}>
                {client.name} {client.surname}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="administratorId" className="block text-sm font-medium text-gray-700">
            Administrator
          </label>
          <select
            id="administratorId"
            {...register('administratorId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          >
            <option value="">Select an administrator</option>
            {advisors
              .filter(advisor => advisor.isAdmin)
              .map((advisor) => (
                <option key={advisor.id} value={String(advisor.id)}>
                  {advisor.name} {advisor.surname}
                </option>
              ))}
          </select>
          {errors.administratorId && (
            <p className="mt-1 text-sm text-red-600">{errors.administratorId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="conclusionDate" className="block text-sm font-medium text-gray-700">
            Conclusion Date
          </label>
          <input
            type="date"
            id="conclusionDate"
            {...register('conclusionDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.conclusionDate && (
            <p className="mt-1 text-sm text-red-600">{errors.conclusionDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="validityDate" className="block text-sm font-medium text-gray-700">
            Validity Date
          </label>
          <input
            type="date"
            id="validityDate"
            {...register('validityDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.validityDate && (
            <p className="mt-1 text-sm text-red-600">{errors.validityDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endingDate" className="block text-sm font-medium text-gray-700">
            Ending Date
          </label>
          <input
            type="date"
            id="endingDate"
            {...register('endingDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.endingDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endingDate.message}</p>
          )}
        </div>
      </div>

      <div className="sm:col-span-2">
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-4">
            Contract Advisors (at least one required)
          </legend>
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-4">
            {advisors.map((advisor) => (
              <label
                key={advisor.id}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  id={`advisor-${advisor.id}`}
                  checked={advisorIds.includes(String(advisor.id))}
                  onChange={() => handleAdvisorToggle(String(advisor.id))}
                  disabled={String(advisor.id) === administratorId}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  {advisor.name} {advisor.surname}
                  {advisor.isAdmin && (
                    <span className="ml-2 inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      Admin
                    </span>
                  )}
                  {String(advisor.id) === administratorId && (
                    <span className="ml-2 text-xs text-gray-500">(Contract Administrator)</span>
                  )}
                </span>
              </label>
            ))}
          </div>
          {advisorIds.length === 0 && (
            <p className="mt-1 text-sm text-red-600">Please select at least one advisor</p>
          )}
        </fieldset>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {contract ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}