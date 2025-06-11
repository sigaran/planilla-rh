import { 
  AttendanceRecord, 
  AttendanceRequest, 
  WorkSchedule, 
  AttendanceSummary,
  ATTENDANCE_STATUS,
  REQUEST_STATUS,
  REQUEST_TYPE,
  AttendanceStatus,
  RequestStatus,
  RequestType,
  RegistrationMethod 
} from '@/app/(main)/attendance/types';

// Horarios de trabajo mock
export const mockWorkSchedules: WorkSchedule[] = [
  {
    id: 'ws1',
    name: 'Horario Administrativo',
    startTime: '08:00',
    endTime: '17:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    workDays: [1, 2, 3, 4, 5], // Lunes a Viernes
    isFlexible: true,
    flexibilityMinutes: 15,
    totalHours: 8
  },
  {
    id: 'ws2',
    name: 'Horario Operativo',
    startTime: '07:00',
    endTime: '16:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    workDays: [1, 2, 3, 4, 5],
    isFlexible: false,
    flexibilityMinutes: 0,
    totalHours: 8
  },
  {
    id: 'ws3',
    name: 'Horario Flexible',
    startTime: '09:00',
    endTime: '18:00',
    lunchStart: '13:00',
    lunchEnd: '14:00',
    workDays: [1, 2, 3, 4, 5],
    isFlexible: true,
    flexibilityMinutes: 30,
    totalHours: 8
  }
];

// Función para generar registros de asistencia mock
function generateAttendanceRecords(): AttendanceRecord[] {
  const employees = [
    { id: 'emp1', firstName: 'Juan Carlos', lastName: 'Pérez Hernández', employeeCode: 'EMP001', department: 'Tecnología', position: 'Desarrollador', workSchedule: mockWorkSchedules[0] },
    { id: 'emp2', firstName: 'María Elena', lastName: 'García López', employeeCode: 'EMP002', department: 'Finanzas', position: 'Contadora', workSchedule: mockWorkSchedules[0] },
    { id: 'emp3', firstName: 'Carlos Antonio', lastName: 'López Martínez', employeeCode: 'EMP003', department: 'Tecnología', position: 'Analista de Sistemas', workSchedule: mockWorkSchedules[1] },
    { id: 'emp4', firstName: 'Ana Sofía', lastName: 'Martínez Vásquez', employeeCode: 'EMP004', department: 'Recursos Humanos', position: 'Gerente de RRHH', workSchedule: mockWorkSchedules[2] },
    { id: 'emp5', firstName: 'Roberto', lastName: 'González Herrera', employeeCode: 'EMP005', department: 'Diseño', position: 'Diseñador UX/UI', workSchedule: mockWorkSchedules[0] }
  ];

  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generar registros para los últimos 30 días
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Solo días laborables (no sábados ni domingos)
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    employees.forEach((employee, empIndex) => {
      const workSchedule = employee.workSchedule;
      
      // Generar diferentes escenarios de asistencia
      const scenarios = getAttendanceScenarios(i, empIndex, workSchedule);
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      records.push({
        id: `att-${employee.id}-${dateStr}`,
        employeeId: employee.id,
        date: dateStr,
        checkIn: scenario.checkIn,
        checkOut: scenario.checkOut,
        lunchStart: scenario.lunchStart,
        lunchEnd: scenario.lunchEnd,
        status: scenario.status,
        lateMinutes: scenario.lateMinutes,
        earlyDepartureMinutes: scenario.earlyDepartureMinutes,
        workedHours: scenario.workedHours,
        overtimeHours: scenario.overtimeHours,
        notes: scenario.notes,
        registrationMethod: scenario.registrationMethod,
        approvedBy: scenario.status !== 'PRESENT' && scenario.status !== 'LATE' ? 'supervisor1' : undefined,
        approvedAt: scenario.status !== 'PRESENT' && scenario.status !== 'LATE' ? new Date().toISOString() : undefined,
        employee: employee,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString()
      });
    });
  }
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getAttendanceScenarios(dayIndex: number, empIndex: number, workSchedule: WorkSchedule) {
  const baseCheckIn = workSchedule.startTime;
  const baseCheckOut = workSchedule.endTime;
  const baseLunchStart = workSchedule.lunchStart;
  const baseLunchEnd = workSchedule.lunchEnd;
  
  const scenarios = [
    // Asistencia normal (70% probabilidad)
    {
      checkIn: baseCheckIn,
      checkOut: baseCheckOut,
      lunchStart: baseLunchStart,
      lunchEnd: baseLunchEnd,
      status: 'PRESENT' as AttendanceStatus,
      lateMinutes: 0,
      earlyDepartureMinutes: 0,
      workedHours: workSchedule.totalHours,
      overtimeHours: 0,
      notes: undefined,
      registrationMethod: 'BIOMETRIC' as RegistrationMethod
    },
    // Llegada tarde (15% probabilidad)
    {
      checkIn: addMinutes(baseCheckIn, 20),
      checkOut: baseCheckOut,
      lunchStart: baseLunchStart,
      lunchEnd: baseLunchEnd,
      status: 'LATE' as AttendanceStatus,
      lateMinutes: 20,
      earlyDepartureMinutes: 0,
      workedHours: workSchedule.totalHours - 0.33,
      overtimeHours: 0,
      notes: 'Retraso por tráfico',
      registrationMethod: 'BIOMETRIC' as RegistrationMethod
    },
    // Horas extras (8% probabilidad)
    {
      checkIn: baseCheckIn,
      checkOut: addMinutes(baseCheckOut, 120),
      lunchStart: baseLunchStart,
      lunchEnd: baseLunchEnd,
      status: 'PRESENT' as AttendanceStatus,
      lateMinutes: 0,
      earlyDepartureMinutes: 0,
      workedHours: workSchedule.totalHours,
      overtimeHours: 2,
      notes: 'Trabajo en proyecto urgente',
      registrationMethod: 'BIOMETRIC' as RegistrationMethod
    },
    // Salida temprana (3% probabilidad)
    {
      checkIn: baseCheckIn,
      checkOut: subtractMinutes(baseCheckOut, 60),
      lunchStart: baseLunchStart,
      lunchEnd: baseLunchEnd,
      status: 'EARLY_DEPARTURE' as AttendanceStatus,
      lateMinutes: 0,
      earlyDepartureMinutes: 60,
      workedHours: workSchedule.totalHours - 1,
      overtimeHours: 0,
      notes: 'Cita médica',
      registrationMethod: 'BIOMETRIC' as RegistrationMethod
    },
    // Medio día (2% probabilidad)
    {
      checkIn: baseCheckIn,
      checkOut: '12:00',
      lunchStart: undefined,
      lunchEnd: undefined,
      status: 'HALF_DAY' as AttendanceStatus,
      lateMinutes: 0,
      earlyDepartureMinutes: 0,
      workedHours: 4,
      overtimeHours: 0,
      notes: 'Permiso personal autorizado',
      registrationMethod: 'MANUAL' as RegistrationMethod
    },
    // Falta justificada (1% probabilidad)
    {
      checkIn: undefined,
      checkOut: undefined,
      lunchStart: undefined,
      lunchEnd: undefined,
      status: 'ABSENT_JUSTIFIED' as AttendanceStatus,
      lateMinutes: 0,
      earlyDepartureMinutes: 0,
      workedHours: 0,
      overtimeHours: 0,
      notes: 'Permiso por enfermedad',
      registrationMethod: 'MANUAL' as RegistrationMethod
    },
    // Vacaciones (1% probabilidad)
    {
      checkIn: undefined,
      checkOut: undefined,
      lunchStart: undefined,
      lunchEnd: undefined,
      status: 'VACATION' as AttendanceStatus,
      lateMinutes: 0,
      earlyDepartureMinutes: 0,
      workedHours: 0,
      overtimeHours: 0,
      notes: 'Vacaciones programadas',
      registrationMethod: 'SYSTEM' as RegistrationMethod
    }
  ];
  
  // Aplicar lógica de probabilidad basada en el empleado y día
  if (dayIndex % 10 === 0 && empIndex === 1) return [scenarios[5]]; // Falta justificada ocasional
  if (dayIndex % 15 === 0 && empIndex === 2) return [scenarios[6]]; // Vacaciones ocasionales
  if (dayIndex < 3 && empIndex === 0) return [scenarios[2]]; // Horas extras recientes
  if (dayIndex % 8 === 0) return [scenarios[1]]; // Llegadas tarde ocasionales
  
  return scenarios;
}

// Función para generar solicitudes de permisos mock
function generateAttendanceRequests(): AttendanceRequest[] {
  const employees = [
    { id: 'emp1', firstName: 'Juan Carlos', lastName: 'Pérez Hernández', employeeCode: 'EMP001', department: 'Tecnología', position: 'Desarrollador' },
    { id: 'emp2', firstName: 'María Elena', lastName: 'García López', employeeCode: 'EMP002', department: 'Finanzas', position: 'Contadora' },
    { id: 'emp3', firstName: 'Carlos Antonio', lastName: 'López Martínez', employeeCode: 'EMP003', department: 'Tecnología', position: 'Analista de Sistemas' },
    { id: 'emp4', firstName: 'Ana Sofía', lastName: 'Martínez Vásquez', employeeCode: 'EMP004', department: 'Recursos Humanos', position: 'Gerente de RRHH' },
    { id: 'emp5', firstName: 'Roberto', lastName: 'González Herrera', employeeCode: 'EMP005', department: 'Diseño', position: 'Diseñador UX/UI' }
  ];

  const requests: AttendanceRequest[] = [];
  const today = new Date();
  
  // Generar solicitudes variadas
  const requestTemplates = [
    {
      type: 'VACATION' as RequestType,
      reason: 'Vacaciones familiares programadas',
      totalDays: 5,
      status: 'APPROVED' as RequestStatus
    },
    {
      type: 'SICK_LEAVE' as RequestType,
      reason: 'Incapacidad médica por gripe',
      totalDays: 2,
      status: 'APPROVED' as RequestStatus
    },
    {
      type: 'PERSONAL_LEAVE' as RequestType,
      reason: 'Asuntos familiares urgentes',
      totalDays: 1,
      status: 'PENDING' as RequestStatus
    },
    {
      type: 'MATERNITY' as RequestType,
      reason: 'Permiso de maternidad',
      totalDays: 126,
      status: 'APPROVED' as RequestStatus
    },
    {
      type: 'STUDY' as RequestType,
      reason: 'Examen universitario',
      totalDays: 1,
      status: 'APPROVED' as RequestStatus
    }
  ];

  employees.forEach((employee, index) => {
    requestTemplates.forEach((template, templateIndex) => {
      if ((index + templateIndex) % 3 === 0) { // Solo algunos empleados tienen ciertas solicitudes
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + (templateIndex * 7) - (index * 2));
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + template.totalDays - 1);
        
        requests.push({
          id: `req-${employee.id}-${templateIndex}`,
          employeeId: employee.id,
          type: template.type,
          status: template.status,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          totalDays: template.totalDays,
          reason: template.reason,
          comments: 'Documentación adjunta',
          attachments: template.type === 'SICK_LEAVE' ? ['medical-certificate.pdf'] : undefined,
          requestedAt: new Date(today.getTime() - (templateIndex * 86400000)).toISOString(),
          reviewedBy: template.status !== 'PENDING' ? 'supervisor1' : undefined,
          reviewedAt: template.status !== 'PENDING' ? new Date().toISOString() : undefined,
          reviewComments: template.status === 'APPROVED' ? 'Solicitud aprobada' : undefined,
          employee: employee,
          createdAt: new Date(today.getTime() - (templateIndex * 86400000)).toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });
  });
  
  return requests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}

// Funciones utilitarias para cálculos de tiempo
function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

function subtractMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins - minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

function calculateTimeDifference(startTime: string, endTime: string): number {
  const [startHours, startMins] = startTime.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);
  
  const startTotalMins = startHours * 60 + startMins;
  const endTotalMins = endHours * 60 + endMins;
  
  return endTotalMins - startTotalMins;
}

// Función para calcular estadísticas de asistencia
export function calculateAttendanceSummary(
  employeeId: string, 
  period: string, 
  records: AttendanceRecord[]
): AttendanceSummary {
  const employeeRecords = records.filter(r => 
    r.employeeId === employeeId && 
    r.date.startsWith(period)
  );
  
  const totalDays = employeeRecords.length;
  const presentDays = employeeRecords.filter(r => 
    ['PRESENT', 'LATE', 'EARLY_DEPARTURE', 'HALF_DAY'].includes(r.status)
  ).length;
  const absentDays = employeeRecords.filter(r => 
    ['ABSENT_JUSTIFIED', 'ABSENT_UNJUSTIFIED'].includes(r.status)
  ).length;
  const lateDays = employeeRecords.filter(r => r.status === 'LATE').length;
  const vacationDays = employeeRecords.filter(r => r.status === 'VACATION').length;
  const sickDays = employeeRecords.filter(r => r.status === 'SICK_LEAVE').length;
  
  const totalWorkedHours = employeeRecords.reduce((sum, r) => sum + r.workedHours, 0);
  const totalOvertimeHours = employeeRecords.reduce((sum, r) => sum + r.overtimeHours, 0);
  const totalLateMinutes = employeeRecords.reduce((sum, r) => sum + r.lateMinutes, 0);
  
  const workDays = totalDays - vacationDays - sickDays;
  const attendanceRate = workDays > 0 ? (presentDays / workDays) * 100 : 0;
  const punctualityRate = presentDays > 0 ? ((presentDays - lateDays) / presentDays) * 100 : 0;
  
  return {
    employeeId,
    period,
    totalDays,
    workDays,
    presentDays,
    absentDays,
    lateDays,
    vacationDays,
    sickDays,
    totalWorkedHours,
    totalOvertimeHours,
    totalLateMinutes,
    attendanceRate: Math.round(attendanceRate * 100) / 100,
    punctualityRate: Math.round(punctualityRate * 100) / 100,
    employee: employeeRecords[0]?.employee
  };
}

// Función para calcular horas trabajadas
export function calculateWorkedHours(
  checkIn?: string, 
  checkOut?: string, 
  lunchStart?: string, 
  lunchEnd?: string
): number {
  if (!checkIn || !checkOut) return 0;
  
  const totalMinutes = calculateTimeDifference(checkIn, checkOut);
  let workedMinutes = totalMinutes;
  
  // Restar tiempo de almuerzo si está definido
  if (lunchStart && lunchEnd) {
    const lunchMinutes = calculateTimeDifference(lunchStart, lunchEnd);
    workedMinutes -= lunchMinutes;
  }
  
  return Math.round((workedMinutes / 60) * 100) / 100;
}

// Función para determinar si hay retraso
export function calculateLateMinutes(
  checkIn: string, 
  expectedStartTime: string, 
  flexibilityMinutes: number = 0
): number {
  const actualMinutes = timeToMinutes(checkIn);
  const expectedMinutes = timeToMinutes(expectedStartTime);
  const allowedMinutes = expectedMinutes + flexibilityMinutes;
  
  return Math.max(0, actualMinutes - allowedMinutes);
}

function timeToMinutes(time: string): number {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}

// Datos mock exportados
export const mockAttendanceRecords = generateAttendanceRecords();
export const mockAttendanceRequests = generateAttendanceRequests();

// Función para filtrar registros
export function filterAttendanceRecords(
  records: AttendanceRecord[],
  filters: {
    employeeId?: string;
    department?: string;
    status?: AttendanceStatus;
    dateFrom?: string;
    dateTo?: string;
    month?: string;
  }
): AttendanceRecord[] {
  return records.filter(record => {
    if (filters.employeeId && record.employeeId !== filters.employeeId) return false;
    if (filters.department && record.employee?.department !== filters.department) return false;
    if (filters.status && record.status !== filters.status) return false;
    if (filters.dateFrom && record.date < filters.dateFrom) return false;
    if (filters.dateTo && record.date > filters.dateTo) return false;
    if (filters.month && !record.date.startsWith(filters.month)) return false;
    
    return true;
  });
}

// Función para filtrar solicitudes
export function filterAttendanceRequests(
  requests: AttendanceRequest[],
  filters: {
    employeeId?: string;
    type?: RequestType;
    status?: RequestStatus;
    dateFrom?: string;
    dateTo?: string;
  }
): AttendanceRequest[] {
  return requests.filter(request => {
    if (filters.employeeId && request.employeeId !== filters.employeeId) return false;
    if (filters.type && request.type !== filters.type) return false;
    if (filters.status && request.status !== filters.status) return false;
    if (filters.dateFrom && request.startDate < filters.dateFrom) return false;
    if (filters.dateTo && request.endDate > filters.dateTo) return false;
    
    return true;
  });
} 