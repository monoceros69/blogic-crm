import axios from 'axios';
import { type Client, type Advisor, type Contract, type ContractAdvisor } from '../types';

const API_BASE = '/api';

const api = axios.create({
	baseURL: API_BASE,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Clients API
export const clientsApi = {
	getAll: () => api.get<Client[]>('/clients'),
	getById: (id: string) => api.get<Client>(`/clients/${id}`),
	create: (client: Omit<Client, 'id'>) => api.post<Client>('/clients', client),
	update: (id: string, client: Partial<Client>) => api.put<Client>(`/clients/${id}`, client),
	delete: (id: string) => api.delete(`/clients/${id}`),
};

// Advisors API
export const advisorsApi = {
	getAll: () => api.get<Advisor[]>('/advisors'),
	getById: (id: string) => api.get<Advisor>(`/advisors/${id}`),
	create: (advisor: Omit<Advisor, 'id'>) => api.post<Advisor>('/advisors', advisor),
	update: (id: string, advisor: Partial<Advisor>) => api.put<Advisor>(`/advisors/${id}`, advisor),
	delete: (id: string) => api.delete(`/advisors/${id}`),
};

// Contracts API
export const contractsApi = {
	getAll: () => api.get<Contract[]>('/contracts'),
	getById: (id: string) => api.get<Contract>(`/contracts/${id}`),
	create: (contract: Omit<Contract, 'id'>) => api.post<Contract>('/contracts', contract),
	update: (id: string, contract: Partial<Contract>) => api.put<Contract>(`/contracts/${id}`, contract),
	delete: (id: string) => api.delete(`/contracts/${id}`),
};

// Contract Advisors API
export const contractAdvisorsApi = {
	getAll: () => api.get<ContractAdvisor[]>('/contractAdvisors'),
	getByContractId: (contractId: string) => 
		api.get<ContractAdvisor[]>(`/contractAdvisors?contractId=${contractId}`),
	create: (relation: Omit<ContractAdvisor, 'id'>) => 
		api.post<ContractAdvisor>('/contractAdvisors', relation),
	delete: (id: string) => api.delete(`/contractAdvisors/${id}`),
};