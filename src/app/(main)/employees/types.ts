export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  status: EmployeeStatus;
  salary: number;
  hireDate: string;
  phoneNumber?: string;
  address?: string;
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