'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Eye, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { mockAttendanceRecords } from '@/lib/attendance';
import { ATTENDANCE_STATUS, AttendanceStatus } from '../types';

interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  attendanceData: {
    [employeeId: string]: {
      status: AttendanceStatus;
      checkIn?: string;
      checkOut?: string;
      notes?: string;
    };
  };
}

export default function AttendanceCalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  // Obtener empleados únicos
  const employees = useMemo(() => {
    const employeeMap = new Map();
    mockAttendanceRecords.forEach(record => {
      if (record.employee && !employeeMap.has(record.employeeId)) {
        employeeMap.set(record.employeeId, record.employee);
      }
    });
    return Array.from(employeeMap.values());
  }, []);

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    // Último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0);
    // Primer día de la semana del mes
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
    
    // Generar 42 días (6 semanas)
    const days: CalendarDay[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isToday = dateStr === today;
      
      // Obtener datos de asistencia para este día
      const attendanceData: CalendarDay['attendanceData'] = {};
      
      const dayRecords = mockAttendanceRecords.filter(record => record.date === dateStr);
      dayRecords.forEach(record => {
        attendanceData[record.employeeId] = {
          status: record.status,
          checkIn: record.checkIn,
          checkOut: record.checkOut,
          notes: record.notes
        };
      });
      
      days.push({
        date: dateStr,
        isCurrentMonth,
        isToday,
        attendanceData
      });
    }
    
    return days;
  }, [currentDate]);

  function navigateMonth(direction: 'prev' | 'next') {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  }

  function getStatusColor(status: AttendanceStatus): string {
    return ATTENDANCE_STATUS[status]?.color || 'bg-gray-500';
  }

  function getStatusIcon(status: AttendanceStatus): string {
    return ATTENDANCE_STATUS[status]?.icon || '?';
  }

  function getDayStatusSummary(day: CalendarDay) {
    const statuses = Object.values(day.attendanceData);
    const summary = {
      present: statuses.filter(s => ['PRESENT', 'LATE'].includes(s.status)).length,
      absent: statuses.filter(s => ['ABSENT_JUSTIFIED', 'ABSENT_UNJUSTIFIED'].includes(s.status)).length,
      vacation: statuses.filter(s => s.status === 'VACATION').length,
      sick: statuses.filter(s => s.status === 'SICK_LEAVE').length,
      total: statuses.length
    };
    
    return summary;
  }

  function renderCalendarCell(day: CalendarDay) {
    const dayNumber = new Date(day.date).getDate();
    const summary = getDayStatusSummary(day);
    
    // Si hay un empleado seleccionado, mostrar solo sus datos
    if (selectedEmployee !== 'all') {
      const employeeData = day.attendanceData[selectedEmployee];
      
      return (
        <div
          className={`
            min-h-[100px] border border-border p-2 cursor-pointer hover:bg-muted/50 transition-colors
            ${!day.isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''}
            ${day.isToday ? 'ring-2 ring-primary ring-inset' : ''}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${day.isToday ? 'text-primary' : ''}`}>
              {dayNumber}
            </span>
            {day.isToday && (
              <Badge variant="default" className="text-xs px-1 py-0">
                Hoy
              </Badge>
            )}
          </div>
          
          {employeeData && day.isCurrentMonth && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`
                    w-full h-8 rounded-md flex items-center justify-center text-xs text-white font-medium
                    ${getStatusColor(employeeData.status)}
                  `}>
                    {getStatusIcon(employeeData.status)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <div className="font-medium">{ATTENDANCE_STATUS[employeeData.status].label}</div>
                    {employeeData.checkIn && (
                      <div>Entrada: {employeeData.checkIn}</div>
                    )}
                    {employeeData.checkOut && (
                      <div>Salida: {employeeData.checkOut}</div>
                    )}
                    {employeeData.notes && (
                      <div className="text-muted-foreground">{employeeData.notes}</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    }
    
    // Vista general de todos los empleados
    return (
      <div
        className={`
          min-h-[100px] border border-border p-2 cursor-pointer hover:bg-muted/50 transition-colors
          ${!day.isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''}
          ${day.isToday ? 'ring-2 ring-primary ring-inset' : ''}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${day.isToday ? 'text-primary' : ''}`}>
            {dayNumber}
          </span>
          {day.isToday && (
            <Badge variant="default" className="text-xs px-1 py-0">
              Hoy
            </Badge>
          )}
        </div>
        
        {day.isCurrentMonth && summary.total > 0 && (
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-1 text-xs">
              {summary.present > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{summary.present}</span>
                </div>
              )}
              {summary.absent > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{summary.absent}</span>
                </div>
              )}
              {summary.vacation > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>{summary.vacation}</span>
                </div>
              )}
              {summary.sick > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>{summary.sick}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Calendario de Asistencias</h1>
            <p className="text-muted-foreground">
              Vista mensual de asistencias del personal
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setCurrentDate(new Date())}
          >
            Hoy
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Todos los empleados
                </div>
              </SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} • {employee.employeeCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leyenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            {Object.entries(ATTENDANCE_STATUS).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${value.color}`}></div>
                <span>{value.icon} {value.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Header de días de la semana */}
          <div className="grid grid-cols-7 border-b">
            {dayNames.map((day) => (
              <div key={day} className="p-4 text-center font-medium text-muted-foreground bg-muted/50">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid de días */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div key={`${day.date}-${index}`}>
                {renderCalendarCell(day)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      {selectedEmployee === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Empleados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Presentes Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {calendarDays.find(d => d.isToday)?.attendanceData ? 
                  Object.values(calendarDays.find(d => d.isToday)?.attendanceData || {})
                    .filter(a => ['PRESENT', 'LATE'].includes(a.status)).length : 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ausentes Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {calendarDays.find(d => d.isToday)?.attendanceData ? 
                  Object.values(calendarDays.find(d => d.isToday)?.attendanceData || {})
                    .filter(a => ['ABSENT_JUSTIFIED', 'ABSENT_UNJUSTIFIED'].includes(a.status)).length : 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">En Vacaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {calendarDays.find(d => d.isToday)?.attendanceData ? 
                  Object.values(calendarDays.find(d => d.isToday)?.attendanceData || {})
                    .filter(a => a.status === 'VACATION').length : 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 