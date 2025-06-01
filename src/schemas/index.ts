import { z } from 'zod';

export const personSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required').regex(/^\+?\d+$/, 'Invalid phone number format (optional + followed by digits)'),
  ssn: z.string().regex(/^\d{6}\/\d{4}$/, 'SSN must be in format 123456/7890'),
  age: z.coerce.number().min(18, 'Must be at least 18').max(120, 'Must be less than 120')
});

export const clientSchema = z.object({
  // Client specific fields if any, otherwise it can just extend Person
}).extend(personSchema.shape);

export const advisorSchema = personSchema.extend({
  isAdmin: z.boolean().optional().default(false)
});

export const contractSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  institution: z.enum(['ČSOB', 'AEGON', 'Axa', 'Other'], {
    errorMap: () => ({ message: 'Please select an institution' })
  }),
  clientId: z.coerce.string().min(1, 'Client is required'),
  administratorId: z.coerce.string().min(1, 'Administrator is required'),
  conclusionDate: z.string().min(1, 'Conclusion date is required'),
  validityDate: z.string().min(1, 'Validity date is required'),
  endingDate: z.string().min(1, 'Ending date is required')
}).refine(
  (data) => new Date(data.validityDate) >= new Date(data.conclusionDate),
  {
    message: 'Validity date must be after or equal to conclusion date',
    path: ['validityDate']
  }
).refine(
  (data) => new Date(data.endingDate) > new Date(data.validityDate),
  {
    message: 'Ending date must be after validity date',
    path: ['endingDate']
  }
);

export type PersonFormData = z.infer<typeof personSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type AdvisorFormData = z.infer<typeof advisorSchema>;
export type ContractFormData = z.infer<typeof contractSchema>;