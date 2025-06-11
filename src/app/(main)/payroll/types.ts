export type PayrollStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';

export interface Payroll {
  id: string;
  month: number;
  year: number;
  period: string;
  status: PayrollStatus;
  employeeId: string;
  
  // Información del empleado (para mostrar en la planilla)
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    dui: string;
    nit: string;
    isssNumber: string;
    afpNumber: string;
    afpName: string;
    position: string;
    department: string;
  };
  
  // Salarios y compensaciones
  baseSalary: number;
  ordinaryHours: number;
  overtimeHours: number;
  overtimeAmount: number;
  bonifications: number;
  aguinaldo: number;
  vacationDays: number;
  vacationAmount: number;
  otherIncome: number;
  
  // Cálculo de ingresos brutos
  grossSalary: number;
  
  // Deducciones obligatorias del empleado
  afpEmployeeAmount: number; // 7.25%
  isssEmployeeAmount: number; // 3%
  rentTax: number; // ISR
  
  // Deducciones opcionales
  personalLoans: number;
  unionFees: number;
  privateInsurance: number;
  cooperativeFees: number;
  otherDeductions: number;
  
  // Total deducciones
  totalDeductions: number;
  
  // Aportes patronales (solo informativo)
  afpEmployerAmount: number; // 7.75%
  isssEmployerAmount: number; // 7.5%
  insaforpAmount: number; // 1%
  
  // Salario neto
  netSalary: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface PayrollCalculation {
  baseSalary: number;
  overtimeAmount: number;
  bonifications: number;
  aguinaldo: number;
  vacationAmount: number;
  otherIncome: number;
  grossSalary: number;
  afpEmployee: number;
  isssEmployee: number;
  rentTax: number;
  personalLoans: number;
  unionFees: number;
  privateInsurance: number;
  cooperativeFees: number;
  otherDeductions: number;
  totalDeductions: number;
  afpEmployer: number;
  isssEmployer: number;
  insaforp: number;
  netSalary: number;
}

export interface CreatePayrollData {
  employeeId: string;
  month: number;
  year: number;
  period: string;
  ordinaryHours: number;
  overtimeHours: number;
  bonifications: number;
  aguinaldo: number;
  vacationDays: number;
  personalLoans: number;
  unionFees: number;
  privateInsurance: number;
  cooperativeFees: number;
  otherDeductions: number;
}

export const PAYROLL_STATUS = {
  PENDING: {
    label: 'Pendiente',
    color: 'bg-yellow-500',
  },
  APPROVED: {
    label: 'Aprobado',
    color: 'bg-blue-500',
  },
  PAID: {
    label: 'Pagado',
    color: 'bg-green-500',
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'bg-red-500',
  },
} as const;

// Constantes para cálculos de El Salvador
export const TAX_RATES = {
  AFP_EMPLOYEE: 0.0725, // 7.25%
  AFP_EMPLOYER: 0.0775, // 7.75%
  ISSS_EMPLOYEE: 0.03, // 3%
  ISSS_EMPLOYER: 0.075, // 7.5%
  INSAFORP: 0.01, // 1%
} as const;

// Topes salariales para ISSS (estos valores deben actualizarse según normativa)
export const SALARY_CAPS = {
  ISSS_MONTHLY_CAP: 1000.00, // Tope mensual ISSS
} as const;

// Tabla de ISR (Impuesto Sobre la Renta) - valores aproximados
export const RENT_TAX_TABLE = [
  { min: 0, max: 472.00, rate: 0, fixedAmount: 0 },
  { min: 472.01, max: 895.24, rate: 0.10, fixedAmount: 17.67 },
  { min: 895.25, max: 2038.10, rate: 0.20, fixedAmount: 60.00 },
  { min: 2038.11, max: Infinity, rate: 0.30, fixedAmount: 288.57 },
] as const; 