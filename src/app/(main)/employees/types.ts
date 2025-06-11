export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type PaymentMethod = 'TRANSFER' | 'CHECK' | 'CASH';
export type Gender = 'M' | 'F';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  
  // Documentos de identificación El Salvador
  dui: string;
  nit: string;
  isssNumber: string;
  afpNumber: string;
  afpName: string;
  
  // Información personal
  birthDate: string;
  gender: Gender;
  phone?: string;
  address?: string;
  
  // Información laboral
  employeeCode?: string; // Código único del empleado
  position: string;
  department: string;
  hireDate: string;
  endDate?: string;
  salary: number;
  status: EmployeeStatus;
  
  // Información bancaria
  bankName?: string;
  accountNumber?: string;
  paymentMethod: PaymentMethod;
  
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export const EMPLOYEE_STATUS = {
  ACTIVE: {
    label: 'Activo',
    color: 'bg-green-500',
  },
  INACTIVE: {
    label: 'Inactivo',
    color: 'bg-gray-500',
  },
  ON_LEAVE: {
    label: 'En Licencia',
    color: 'bg-yellow-500',
  },
  TERMINATED: {
    label: 'Terminado',
    color: 'bg-red-500',
  },
} as const;

export const PAYMENT_METHODS = {
  TRANSFER: {
    label: 'Transferencia Bancaria',
    value: 'TRANSFER'
  },
  CHECK: {
    label: 'Cheque',
    value: 'CHECK'
  },
  CASH: {
    label: 'Efectivo',
    value: 'CASH'
  }
} as const;

export const AFP_OPTIONS = [
  'AFP Crecer',
  'AFP Confía',
  'AFP Porvenir'
] as const; 