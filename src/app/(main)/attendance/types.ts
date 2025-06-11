export type AttendanceStatus = 
  | 'PRESENT'           // Asistencia normal
  | 'LATE'              // Llegada tarde
  | 'ABSENT_JUSTIFIED'  // Falta justificada
  | 'ABSENT_UNJUSTIFIED' // Falta injustificada
  | 'VACATION'          // Vacaciones
  | 'SICK_LEAVE'        // Incapacidad médica
  | 'PERSONAL_LEAVE'    // Permiso personal
  | 'EARLY_DEPARTURE'   // Salida temprana
  | 'HALF_DAY';         // Medio día

export type RequestStatus = 
  | 'PENDING'    // Pendiente de aprobación
  | 'APPROVED'   // Aprobado
  | 'REJECTED'   // Rechazado
  | 'CANCELLED'; // Cancelado

export type RequestType = 
  | 'VACATION'      // Solicitud de vacaciones
  | 'SICK_LEAVE'    // Solicitud de incapacidad
  | 'PERSONAL_LEAVE' // Permiso personal
  | 'MATERNITY'     // Permiso de maternidad
  | 'PATERNITY'     // Permiso de paternidad
  | 'STUDY'         // Permiso de estudio
  | 'OTHER';        // Otro tipo

export type RegistrationMethod = 
  | 'MANUAL'        // Registro manual
  | 'BIOMETRIC'     // Reloj biométrico
  | 'CARD'          // Tarjeta magnética
  | 'APP'           // Aplicación móvil
  | 'SYSTEM';       // Sistema automático

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  
  // Horarios
  checkIn?: string;     // HH:MM
  checkOut?: string;    // HH:MM
  lunchStart?: string;  // HH:MM
  lunchEnd?: string;    // HH:MM
  
  // Estado y cálculos
  status: AttendanceStatus;
  lateMinutes: number;        // Minutos de retraso
  earlyDepartureMinutes: number; // Minutos de salida temprana
  workedHours: number;        // Horas trabajadas
  overtimeHours: number;      // Horas extras
  
  // Información adicional
  notes?: string;             // Notas o justificaciones
  registrationMethod: RegistrationMethod;
  approvedBy?: string;        // ID del supervisor que aprobó
  approvedAt?: string;        // Fecha de aprobación
  
  // Información del empleado (para mostrar en listas)
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    department: string;
    position: string;
    workSchedule?: WorkSchedule;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface WorkSchedule {
  id: string;
  name: string;           // "Horario Administrativo", "Horario Operativo"
  startTime: string;      // "08:00"
  endTime: string;        // "17:00"
  lunchStart?: string;    // "12:00"
  lunchEnd?: string;      // "13:00"
  workDays: number[];     // [1,2,3,4,5] = Lunes a Viernes
  isFlexible: boolean;    // Horario flexible
  flexibilityMinutes: number; // +/- minutos de tolerancia
  totalHours: number;     // 8 horas diarias
}

export interface AttendanceRequest {
  id: string;
  employeeId: string;
  type: RequestType;
  status: RequestStatus;
  
  // Fechas
  startDate: string;      // YYYY-MM-DD
  endDate: string;        // YYYY-MM-DD
  totalDays: number;      // Días solicitados
  
  // Detalles
  reason: string;         // Motivo de la solicitud
  comments?: string;      // Comentarios adicionales
  attachments?: string[]; // URLs de documentos adjuntos
  
  // Aprobación
  requestedAt: string;
  reviewedBy?: string;    // ID del supervisor
  reviewedAt?: string;    // Fecha de revisión
  reviewComments?: string; // Comentarios del revisor
  
  // Información del empleado
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    department: string;
    position: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  employeeId: string;
  period: string;         // "2024-03" para marzo 2024
  
  // Contadores
  totalDays: number;      // Días del período
  workDays: number;       // Días laborables
  presentDays: number;    // Días asistidos
  absentDays: number;     // Días ausentes
  lateDays: number;       // Días con retraso
  vacationDays: number;   // Días de vacaciones
  sickDays: number;       // Días de incapacidad
  
  // Horas
  totalWorkedHours: number;   // Total horas trabajadas
  totalOvertimeHours: number; // Total horas extras
  totalLateMinutes: number;   // Total minutos de retraso
  
  // Porcentajes
  attendanceRate: number;     // % de asistencia
  punctualityRate: number;    // % de puntualidad
  
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    department: string;
    position: string;
  };
}

export interface CreateAttendanceData {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  lunchStart?: string;
  lunchEnd?: string;
  status: AttendanceStatus;
  notes?: string;
  registrationMethod: RegistrationMethod;
}

export interface CreateRequestData {
  employeeId: string;
  type: RequestType;
  startDate: string;
  endDate: string;
  reason: string;
  comments?: string;
  attachments?: string[];
}

// Constantes para la UI
export const ATTENDANCE_STATUS = {
  PRESENT: {
    label: 'Presente',
    color: 'bg-green-500',
    icon: '✓'
  },
  LATE: {
    label: 'Tarde',
    color: 'bg-yellow-500',
    icon: '⏰'
  },
  ABSENT_JUSTIFIED: {
    label: 'Falta Justificada',
    color: 'bg-blue-500',
    icon: '📋'
  },
  ABSENT_UNJUSTIFIED: {
    label: 'Falta Injustificada',
    color: 'bg-red-500',
    icon: '❌'
  },
  VACATION: {
    label: 'Vacaciones',
    color: 'bg-purple-500',
    icon: '🏖️'
  },
  SICK_LEAVE: {
    label: 'Incapacidad',
    color: 'bg-orange-500',
    icon: '🏥'
  },
  PERSONAL_LEAVE: {
    label: 'Permiso Personal',
    color: 'bg-indigo-500',
    icon: '👤'
  },
  EARLY_DEPARTURE: {
    label: 'Salida Temprana',
    color: 'bg-amber-500',
    icon: '🏃'
  },
  HALF_DAY: {
    label: 'Medio Día',
    color: 'bg-teal-500',
    icon: '🕐'
  }
} as const;

export const REQUEST_STATUS = {
  PENDING: {
    label: 'Pendiente',
    color: 'bg-yellow-500'
  },
  APPROVED: {
    label: 'Aprobado',
    color: 'bg-green-500'
  },
  REJECTED: {
    label: 'Rechazado',
    color: 'bg-red-500'
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'bg-gray-500'
  }
} as const;

export const REQUEST_TYPE = {
  VACATION: {
    label: 'Vacaciones',
    icon: '🏖️',
    maxDays: 30
  },
  SICK_LEAVE: {
    label: 'Incapacidad',
    icon: '🏥',
    maxDays: 365
  },
  PERSONAL_LEAVE: {
    label: 'Permiso Personal',
    icon: '👤',
    maxDays: 5
  },
  MATERNITY: {
    label: 'Maternidad',
    icon: '👶',
    maxDays: 126
  },
  PATERNITY: {
    label: 'Paternidad',
    icon: '👨‍👶',
    maxDays: 3
  },
  STUDY: {
    label: 'Permiso de Estudio',
    icon: '📚',
    maxDays: 10
  },
  OTHER: {
    label: 'Otro',
    icon: '📄',
    maxDays: 30
  }
} as const;

export const REGISTRATION_METHOD = {
  MANUAL: {
    label: 'Manual',
    icon: '✏️'
  },
  BIOMETRIC: {
    label: 'Biométrico',
    icon: '👆'
  },
  CARD: {
    label: 'Tarjeta',
    icon: '💳'
  },
  APP: {
    label: 'App Móvil',
    icon: '📱'
  },
  SYSTEM: {
    label: 'Sistema',
    icon: '��'
  }
} as const; 