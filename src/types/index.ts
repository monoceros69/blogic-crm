export interface Client {
    id?: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    ssn: string;
    age: number;
  }
  
  export interface Advisor {
    id?: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    ssn: string;
    age: number;
    isAdmin?: boolean;
  }
  
  export interface Contract {
    id?: number;
    registrationNumber: string;
    institution: string;
    clientId: number;
    administratorId: number;
    conclusionDate: string;
    validityDate: string;
    endingDate: string;
  }
  
  export interface ContractAdvisor {
    id?: number;
    contractId: number;
    advisorId: number;
  }