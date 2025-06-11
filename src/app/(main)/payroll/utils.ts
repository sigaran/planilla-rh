import { TAX_RATES, SALARY_CAPS, RENT_TAX_TABLE, PayrollCalculation } from './types';

export function calculateOvertimeAmount(overtimeHours: number, hourlyRate: number): number {
  // En El Salvador, las horas extras se pagan al 100% adicional (doble)
  return overtimeHours * hourlyRate * 2;
}

export function calculateHourlyRate(monthlySalary: number): number {
  // Asumiendo 8 horas diarias, 22 días laborables al mes
  const hoursPerMonth = 8 * 22;
  return monthlySalary / hoursPerMonth;
}

export function calculateVacationAmount(vacationDays: number, dailySalary: number): number {
  return vacationDays * dailySalary;
}

export function calculateDailySalary(monthlySalary: number): number {
  // 30 días del mes
  return monthlySalary / 30;
}

export function calculateAFPEmployee(grossSalary: number): number {
  return grossSalary * TAX_RATES.AFP_EMPLOYEE;
}

export function calculateAFPEmployer(grossSalary: number): number {
  return grossSalary * TAX_RATES.AFP_EMPLOYER;
}

export function calculateISSS(grossSalary: number, isEmployee: boolean = true): number {
  const cappedSalary = Math.min(grossSalary, SALARY_CAPS.ISSS_MONTHLY_CAP);
  const rate = isEmployee ? TAX_RATES.ISSS_EMPLOYEE : TAX_RATES.ISSS_EMPLOYER;
  return cappedSalary * rate;
}

export function calculateINSAFORP(grossSalary: number): number {
  return grossSalary * TAX_RATES.INSAFORP;
}

export function calculateRentTax(grossSalary: number): number {
  // Aplicar tabla de ISR
  for (const bracket of RENT_TAX_TABLE) {
    if (grossSalary >= bracket.min && grossSalary <= bracket.max) {
      if (bracket.rate === 0) {
        return 0;
      }
      const excessAmount = grossSalary - bracket.min;
      return bracket.fixedAmount + (excessAmount * bracket.rate);
    }
  }
  
  // Si está fuera del rango, aplicar la tasa más alta
  const lastBracket = RENT_TAX_TABLE[RENT_TAX_TABLE.length - 1];
  const excessAmount = grossSalary - lastBracket.min;
  return lastBracket.fixedAmount + (excessAmount * lastBracket.rate);
}

export function calculatePayroll(data: {
  baseSalary: number;
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
}): PayrollCalculation {
  const {
    baseSalary,
    ordinaryHours,
    overtimeHours,
    bonifications,
    aguinaldo,
    vacationDays,
    personalLoans,
    unionFees,
    privateInsurance,
    cooperativeFees,
    otherDeductions
  } = data;

  // Calcular monto de horas extras
  const hourlyRate = calculateHourlyRate(baseSalary);
  const overtimeAmount = calculateOvertimeAmount(overtimeHours, hourlyRate);
  
  // Calcular monto de vacaciones
  const dailySalary = calculateDailySalary(baseSalary);
  const vacationAmount = calculateVacationAmount(vacationDays, dailySalary);
  
  // Calcular salario bruto
  const grossSalary = baseSalary + overtimeAmount + bonifications + aguinaldo + vacationAmount;
  
  // Calcular deducciones obligatorias
  const afpEmployee = calculateAFPEmployee(grossSalary);
  const isssEmployee = calculateISSS(grossSalary, true);
  const rentTax = calculateRentTax(grossSalary);
  
  // Calcular aportes patronales
  const afpEmployer = calculateAFPEmployer(grossSalary);
  const isssEmployer = calculateISSS(grossSalary, false);
  const insaforp = calculateINSAFORP(grossSalary);
  
  // Total deducciones
  const totalDeductions = afpEmployee + isssEmployee + rentTax + 
                         personalLoans + unionFees + privateInsurance + 
                         cooperativeFees + otherDeductions;
  
  // Salario neto
  const netSalary = grossSalary - totalDeductions;
  
  return {
    baseSalary,
    overtimeAmount,
    bonifications,
    aguinaldo,
    vacationAmount,
    otherIncome: 0, // Se puede agregar si es necesario
    grossSalary,
    afpEmployee,
    isssEmployee,
    rentTax,
    personalLoans,
    unionFees,
    privateInsurance,
    cooperativeFees,
    otherDeductions,
    totalDeductions,
    afpEmployer,
    isssEmployer,
    insaforp,
    netSalary
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1] || '';
}

export function generatePeriodString(month: number, year: number): string {
  return `${getMonthName(month)} ${year}`;
} 