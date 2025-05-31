export interface Client {
    id?: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    ssn: string;
    age: number;
  }
  
  export interface Advisor {
    id?: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    ssn: string;
    age: number;
    isAdmin?: boolean;
  }
  
  export interface Contract {
    id?: string;
    registrationNumber: string;
    institution: string;
    clientId: string | number;
    administratorId: string | number;
    conclusionDate: string;
    validityDate: string;
    endingDate: string;
  }
  
  export interface ContractAdvisor {
    id?: string;
    contractId: string | number;
    advisorId: string | number;
  }