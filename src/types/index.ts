// Base person interface
  export interface Person {
    id?: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    ssn: string;
    age: number;
  }

  // Client extends Person (no additional fields needed)
  export interface Client extends Person {}

  // Advisor extends Person with additional isAdmin field
  export interface Advisor extends Person {
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