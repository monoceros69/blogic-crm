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
	getById: (id: number) => api.get<Client>(`/clients/${id}`),
	create: (client: Omit<Client, 'id'>) => api.post<Client>('/clients', client),
	update: (id: number, client: Partial<Client>) => api.put<Client>(`/clients/${id}`, client),
	delete: (id: number) => api.delete(`/clients/${id}`),
};

// Advisors API
export const advisorsApi = {
	getAll: () => api.get<Advisor[]>('/advisors'),
	getById: (id: number) => api.get<Advisor>(`/advisors/${id}`),
	create: (advisor: Omit<Advisor, 'id'>) => api.post<Advisor>('/advisors', advisor),
	update: (id: number, advisor: Partial<Advisor>) => api.put<Advisor>(`/advisors/${id}`, advisor),
	delete: (id: number) => api.delete(`/advisors/${id}`),
};

// Contracts API
export const contractsApi = {
	getAll: () => api.get<Contract[]>('/contracts'),
	getById: (id: number) => api.get<Contract>(`/contracts/${id}`),
	create: (contract: Omit<Contract, 'id'>) => api.post<Contract>('/contracts', contract),
	update: (id: number, contract: Partial<Contract>) => api.put<Contract>(`/contracts/${id}`, contract),
	delete: (id: number) => api.delete(`/contracts/${id}`),
};

// Contract Advisors API
export const contractAdvisorsApi = {
	getAll: () => api.get<ContractAdvisor[]>('/contractAdvisors'),
	getByContractId: (contractId: number) => 
		api.get<ContractAdvisor[]>(`/contractAdvisors?contractId=${contractId}`),
	create: (relation: Omit<ContractAdvisor, 'id'>) => 
		api.post<ContractAdvisor>('/contractAdvisors', relation),
	delete: (id: number) => api.delete(`/contractAdvisors/${id}`),
};