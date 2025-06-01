import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Person, type Advisor } from '../types';
import { personSchema, advisorSchema, type PersonFormData } from '../schemas';

interface PersonFormProps {
  person?: Person | Advisor; // Can be a Person or an Advisor (which extends Person)
  isAdvisor?: boolean; // Flag to indicate if this form is for an Advisor
  onSubmit: (data: PersonFormData & { isAdmin?: boolean }) => void; // Include isAdmin in submit data
  onCancel: () => void;
  onFormChange: (hasChanges: boolean) => void;
}

export function PersonForm({
  person,
  isAdvisor = false,
  onSubmit,
  onCancel,
  onFormChange
}: PersonFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<PersonFormData & { isAdmin?: boolean }>({
    resolver: zodResolver(isAdvisor ? advisorSchema : personSchema as any), // Use advisorSchema for advisors, otherwise personSchema
    defaultValues: person
      ? {
          name: person.name,
          surname: person.surname,
          email: person.email,
          phone: person.phone,
          ssn: person.ssn,
          age: person.age,
          ...(isAdvisor && (person as Advisor).isAdmin !== undefined && { isAdmin: (person as Advisor).isAdmin }),
        }
      : undefined,
  });

  // Scroll form into view when the person prop changes or form is initially rendered
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [person]);

  // Watch form fields for changes and notify parent component
  useEffect(() => {
    const subscription = watch(() => {
      onFormChange(isDirty);
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty, onFormChange]);

  // Reset form when the person prop changes (for editing)
  useEffect(() => {
    if (person) {
      reset({
        name: person.name,
        surname: person.surname,
        email: person.email,
        phone: person.phone,
        ssn: person.ssn,
        age: person.age,
        ...(isAdvisor && (person as Advisor).isAdmin !== undefined && { isAdmin: (person as Advisor).isAdmin }),
      });
    } else {
      // Reset to empty when creating a new entry
      reset({
        name: '',
        surname: '',
        email: '',
        phone: '',
        ssn: '',
        age: 18,
        ...(isAdvisor && { isAdmin: false }),
      });
    }
  }, [person, reset, isAdvisor]);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
            Surname
          </label>
          <input
            type="text"
            id="surname"
            {...register('surname')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.surname && (
            <p className="mt-1 text-sm text-red-600">{errors.surname.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="ssn" className="block text-sm font-medium text-gray-700">
            SSN
          </label>
          <input
            type="text"
            id="ssn"
            {...register('ssn')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.ssn && (
            <p className="mt-1 text-sm text-red-600">{errors.ssn.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            type="number"
            id="age"
            {...register('age', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>
      </div>

      {isAdvisor && (
        <div className="sm:col-span-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isAdmin"
                type="checkbox"
                {...register('isAdmin')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isAdmin" className="font-medium text-gray-700">
                Administrator
              </label>
              <p className="text-gray-500">
                Administrators can manage contracts and have elevated permissions.
              </p>
            </div>
          </div>
        </div>
      )}

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
          {person ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
} 