'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, User, Save, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

import { mockEmployees } from '@/lib/employees';
import { mockWorkSchedules, calculateWorkedHours, calculateLateMinutes } from '@/lib/attendance';
import { 
  ATTENDANCE_STATUS, 
  REGISTRATION_METHOD,
  AttendanceStatus, 
  RegistrationMethod,
  CreateAttendanceData 
} from '../types';

export default function RegisterAttendancePage() {
  const router = useRouter();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [formData, setFormData] = useState<CreateAttendanceData>({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    lunchStart: '',
    lunchEnd: '',
    status: 'PRESENT',
    notes: '',
    registrationMethod: 'MANUAL'
  });

  const [calculatedValues, setCalculatedValues] = useState({
    workedHours: 0,
    lateMinutes: 0,
    overtimeHours: 0,
    earlyDepartureMinutes: 0
  });

  const selectedEmployee = mockEmployees?.find(emp => emp.id === selectedEmployeeId);
  const workSchedule = selectedEmployee ? mockWorkSchedules?.find(ws => ws.id === 'ws1') : null; // Default schedule

  // Calcular valores automáticamente cuando cambian los horarios
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && workSchedule) {
      const workedHours = calculateWorkedHours(
        formData.checkIn,
        formData.checkOut,
        formData.lunchStart,
        formData.lunchEnd
      );

      const lateMinutes = formData.checkIn ? 
        calculateLateMinutes(formData.checkIn, workSchedule.startTime, workSchedule.flexibilityMinutes) : 0;

      const expectedHours = workSchedule.totalHours;
      const overtimeHours = Math.max(0, workedHours - expectedHours);

      // Calcular salida temprana
      const checkOutTime = timeToMinutes(formData.checkOut);
      const expectedEndTime = timeToMinutes(workSchedule.endTime);
      const earlyDepartureMinutes = Math.max(0, expectedEndTime - checkOutTime);

      setCalculatedValues({
        workedHours: Math.round(workedHours * 100) / 100,
        lateMinutes,
        overtimeHours: Math.round(overtimeHours * 100) / 100,
        earlyDepartureMinutes
      });

      // Auto-detectar estado
      let autoStatus: AttendanceStatus = 'PRESENT';
      if (lateMinutes > 0) autoStatus = 'LATE';
      if (earlyDepartureMinutes > 60) autoStatus = 'EARLY_DEPARTURE';
      if (workedHours <= 4) autoStatus = 'HALF_DAY';

      setFormData(prev => ({ ...prev, status: autoStatus }));
    }
  }, [formData.checkIn, formData.checkOut, formData.lunchStart, formData.lunchEnd, workSchedule]);

  function timeToMinutes(time: string): number {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  }

  function handleEmployeeSelect(employeeId: string) {
    setSelectedEmployeeId(employeeId);
    setFormData(prev => ({ ...prev, employeeId }));
  }

  function handleInputChange(field: keyof CreateAttendanceData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function fillCurrentTime(field: 'checkIn' | 'checkOut' | 'lunchStart' | 'lunchEnd') {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    handleInputChange(field, currentTime);
  }

  function autoFillSchedule() {
    if (!workSchedule) return;

    setFormData(prev => ({
      ...prev,
      checkIn: workSchedule.startTime,
      checkOut: workSchedule.endTime,
      lunchStart: workSchedule.lunchStart || '',
      lunchEnd: workSchedule.lunchEnd || ''
    }));
  }

  function handleSubmit() {
    // Aquí se enviarían los datos al backend
    console.log('Guardando registro de asistencia:', {
      ...formData,
      ...calculatedValues
    });
    
    router.push('/attendance');
  }

  function getStatusInfo(status: AttendanceStatus) {
    return ATTENDANCE_STATUS[status];
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Registrar Asistencia</h1>
          <p className="text-muted-foreground">
            Registro manual de entrada y salida de empleados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selección de Empleado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Selección de Empleado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="employee">Empleado</Label>
                <Select value={selectedEmployeeId} onValueChange={handleEmployeeSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {employee.employeeCode} • {employee.department}
                          </span>
                        </div>
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
              </div>

              {selectedEmployee && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Código:</span>
                      <span className="ml-2 font-medium">{selectedEmployee.employeeCode}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Departamento:</span>
                      <span className="ml-2">{selectedEmployee.department}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Posición:</span>
                      <span className="ml-2">{selectedEmployee.position}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">DUI:</span>
                      <span className="ml-2 font-mono">{selectedEmployee.dui}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registro de Horarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios de Trabajo
              </CardTitle>
              <CardDescription>
                Registre los horarios de entrada y salida del empleado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Hora de Entrada</Label>
                  <div className="flex gap-2">
                    <Input
                      id="checkIn"
                      type="time"
                      value={formData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fillCurrentTime('checkIn')}
                    >
                      Ahora
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="checkOut">Hora de Salida</Label>
                  <div className="flex gap-2">
                    <Input
                      id="checkOut"
                      type="time"
                      value={formData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fillCurrentTime('checkOut')}
                    >
                      Ahora
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lunchStart">Inicio de Almuerzo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="lunchStart"
                      type="time"
                      value={formData.lunchStart}
                      onChange={(e) => handleInputChange('lunchStart', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fillCurrentTime('lunchStart')}
                    >
                      Ahora
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="lunchEnd">Fin de Almuerzo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="lunchEnd"
                      type="time"
                      value={formData.lunchEnd}
                      onChange={(e) => handleInputChange('lunchEnd', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fillCurrentTime('lunchEnd')}
                    >
                      Ahora
                    </Button>
                  </div>
                </div>
              </div>

              {workSchedule && (
                <Alert>
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>Horario programado:</strong> {workSchedule.startTime} - {workSchedule.endTime}
                        {workSchedule.lunchStart && (
                          <span> (Almuerzo: {workSchedule.lunchStart} - {workSchedule.lunchEnd})</span>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={autoFillSchedule}>
                        Auto-llenar
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Estado y Detalles */}
          <Card>
            <CardHeader>
              <CardTitle>Estado y Observaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Estado de Asistencia</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ATTENDANCE_STATUS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{value.icon}</span>
                          <span>{value.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="registrationMethod">Método de Registro</Label>
                <Select 
                  value={formData.registrationMethod} 
                  onValueChange={(value) => handleInputChange('registrationMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REGISTRATION_METHOD).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{value.icon}</span>
                          <span>{value.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notas y Observaciones</Label>
                <Textarea
                  id="notes"
                  placeholder="Agregar notas sobre la asistencia, justificaciones, etc..."
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Resumen */}
        <div className="space-y-6">
          {/* Resumen de Cálculos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cálculos Automáticos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Horas trabajadas:</span>
                  <span className="font-medium">{calculatedValues.workedHours}h</span>
                </div>

                {calculatedValues.lateMinutes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Minutos de retraso:</span>
                    <span className="font-medium text-yellow-600">{calculatedValues.lateMinutes} min</span>
                  </div>
                )}

                {calculatedValues.overtimeHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Horas extra:</span>
                    <span className="font-medium text-blue-600">{calculatedValues.overtimeHours}h</span>
                  </div>
                )}

                {calculatedValues.earlyDepartureMinutes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Salida temprana:</span>
                    <span className="font-medium text-orange-600">{calculatedValues.earlyDepartureMinutes} min</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Estado detectado:</div>
                <div>
                  {(() => {
                    const statusInfo = getStatusInfo(formData.status);
                    return (
                      <Badge className={`${statusInfo.color} text-white`}>
                        <span className="mr-1">{statusInfo.icon}</span>
                        {statusInfo.label}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Horario */}
          {workSchedule && (
            <Card>
              <CardHeader>
                <CardTitle>Horario Programado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span>{workSchedule.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horario:</span>
                    <span>{workSchedule.startTime} - {workSchedule.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horas diarias:</span>
                    <span>{workSchedule.totalHours}h</span>
                  </div>
                  {workSchedule.isFlexible && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Flexibilidad:</span>
                      <span>±{workSchedule.flexibilityMinutes} min</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={!selectedEmployeeId || !formData.date}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Registro
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 