'use client';

import { useState, useMemo } from 'react';
import { Calendar, Clock, Users, TrendingUp, Filter, Plus, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

import { 
  mockAttendanceRecords, 
  mockAttendanceRequests, 
  filterAttendanceRecords,
  filterAttendanceRequests,
  calculateAttendanceSummary 
} from '@/lib/attendance';
import { 
  AttendanceRecord, 
  AttendanceRequest,
  ATTENDANCE_STATUS, 
  REQUEST_STATUS,
  REQUEST_TYPE,
  AttendanceStatus,
  RequestStatus,
  RequestType 
} from './types';

interface AttendanceFilters {
  search: string;
  department: string;
  status: AttendanceStatus | 'all';
  month: string;
  employeeId: string;
}

interface RequestFilters {
  search: string;
  type: RequestType | 'all';
  status: RequestStatus | 'all';
  employeeId: string;
}

export default function AttendancePage() {
  const [attendanceFilters, setAttendanceFilters] = useState<AttendanceFilters>({
    search: '',
    department: 'all',
    status: 'all',
    month: 'all',
    employeeId: 'all'
  });

  const [requestFilters, setRequestFilters] = useState<RequestFilters>({
    search: '',
    type: 'all',
    status: 'all',
    employeeId: 'all'
  });

  // Obtener los registros y solicitudes filtrados
  const filteredAttendanceRecords = useMemo(() => {
    let filtered = filterAttendanceRecords(mockAttendanceRecords, {
      department: attendanceFilters.department !== 'all' ? attendanceFilters.department : undefined,
      status: attendanceFilters.status !== 'all' ? attendanceFilters.status : undefined,
      month: attendanceFilters.month !== 'all' ? attendanceFilters.month : undefined,
      employeeId: attendanceFilters.employeeId !== 'all' ? attendanceFilters.employeeId : undefined
    });

    // Filtro de búsqueda por nombre
    if (attendanceFilters.search) {
      filtered = filtered.filter(record => {
        const fullName = `${record.employee?.firstName} ${record.employee?.lastName}`.toLowerCase();
        const employeeCode = record.employee?.employeeCode?.toLowerCase() || '';
        const searchTerm = attendanceFilters.search.toLowerCase();
        
        return fullName.includes(searchTerm) || employeeCode.includes(searchTerm);
      });
    }

    return filtered;
  }, [attendanceFilters, mockAttendanceRecords]);

  const filteredRequests = useMemo(() => {
    let filtered = filterAttendanceRequests(mockAttendanceRequests, {
      type: requestFilters.type !== 'all' ? requestFilters.type : undefined,
      status: requestFilters.status !== 'all' ? requestFilters.status : undefined,
      employeeId: requestFilters.employeeId !== 'all' ? requestFilters.employeeId : undefined
    });

    // Filtro de búsqueda por nombre
    if (requestFilters.search) {
      filtered = filtered.filter(request => {
        const fullName = `${request.employee?.firstName} ${request.employee?.lastName}`.toLowerCase();
        const employeeCode = request.employee?.employeeCode?.toLowerCase() || '';
        const searchTerm = requestFilters.search.toLowerCase();
        
        return fullName.includes(searchTerm) || employeeCode.includes(searchTerm);
      });
    }

    return filtered;
  }, [requestFilters, mockAttendanceRequests]);

  // Calcular estadísticas del dashboard
  const dashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7); // YYYY-MM
    
    const todayRecords = mockAttendanceRecords.filter(r => r.date === today);
    const monthRecords = mockAttendanceRecords.filter(r => r.date.startsWith(currentMonth));
    const pendingRequests = mockAttendanceRequests.filter(r => r.status === 'PENDING');
    
    const presentToday = todayRecords.filter(r => ['PRESENT', 'LATE'].includes(r.status)).length;
    const lateToday = todayRecords.filter(r => r.status === 'LATE').length;
    const absentToday = todayRecords.filter(r => ['ABSENT_JUSTIFIED', 'ABSENT_UNJUSTIFIED'].includes(r.status)).length;
    
    const totalEmployees = new Set(mockAttendanceRecords.map(r => r.employeeId)).size;
    const attendanceRate = totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0;
    
    const totalOvertimeHours = monthRecords.reduce((sum, r) => sum + r.overtimeHours, 0);
    
    return {
      totalEmployees,
      presentToday,
      lateToday,
      absentToday,
      attendanceRate: Math.round(attendanceRate),
      pendingRequests: pendingRequests.length,
      totalOvertimeHours: Math.round(totalOvertimeHours * 10) / 10
    };
  }, [mockAttendanceRecords, mockAttendanceRequests]);

  // Obtener opciones únicas para filtros
  const departments = [...new Set(mockAttendanceRecords.map(r => r.employee?.department).filter(Boolean))] as string[];
  const months = [...new Set(mockAttendanceRecords.map(r => r.date.substring(0, 7)))].sort().reverse();

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getStatusBadge(status: AttendanceStatus) {
    const statusInfo = ATTENDANCE_STATUS[status];
    return (
      <Badge variant="secondary" className={`${statusInfo.color} text-white`}>
        <span className="mr-1">{statusInfo.icon}</span>
        {statusInfo.label}
      </Badge>
    );
  }

  function getRequestStatusBadge(status: RequestStatus) {
    const statusInfo = REQUEST_STATUS[status];
    return (
      <Badge variant="secondary" className={`${statusInfo.color} text-white`}>
        {statusInfo.label}
      </Badge>
    );
  }

  function getRequestTypeBadge(type: RequestType) {
    const typeInfo = REQUEST_TYPE[type];
    return (
      <Badge variant="outline">
        <span className="mr-1">{typeInfo.icon}</span>
        {typeInfo.label}
      </Badge>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Asistencias</h1>
          <p className="text-muted-foreground mt-2">
            Control completo de asistencias, puntualidad y solicitudes del personal
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/attendance/register">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Registrar Asistencia
            </Button>
          </Link>
          <Link href="/attendance/request">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Nueva Solicitud
            </Button>
          </Link>
          <Link href="/attendance/calendar">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Vista Calendario
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados Presentes Hoy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardStats.presentToday}/{dashboardStats.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasa de asistencia: {dashboardStats.attendanceRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Llegadas Tarde Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {dashboardStats.lateToday}
            </div>
            <p className="text-xs text-muted-foreground">
              Ausentes: {dashboardStats.absentToday}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardStats.pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Extra (Mes)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats.totalOvertimeHours}h
            </div>
            <p className="text-xs text-muted-foreground">
              Horas adicionales trabajadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Registros de Asistencia</TabsTrigger>
          <TabsTrigger value="requests">Solicitudes de Permisos</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        {/* Tab de Registros de Asistencia */}
        <TabsContent value="attendance" className="space-y-4">
          {/* Filtros de Asistencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Buscar empleado..."
                value={attendanceFilters.search}
                onChange={(e) => setAttendanceFilters(prev => ({...prev, search: e.target.value}))}
              />
              
              <Select 
                value={attendanceFilters.department} 
                onValueChange={(value) => setAttendanceFilters(prev => ({...prev, department: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={attendanceFilters.status} 
                onValueChange={(value) => setAttendanceFilters(prev => ({...prev, status: value as AttendanceStatus}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(ATTENDANCE_STATUS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.icon} {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={attendanceFilters.month} 
                onValueChange={(value) => setAttendanceFilters(prev => ({...prev, month: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los meses</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>
                      {new Date(month + '-01').toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => setAttendanceFilters({search: '', department: 'all', status: 'all', month: 'all', employeeId: 'all'})}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>

          {/* Tabla de Asistencias */}
          <Card>
            <CardHeader>
              <CardTitle>Registros de Asistencia ({filteredAttendanceRecords.length})</CardTitle>
              <CardDescription>
                Historial completo de asistencias del personal con detalles de horarios y estados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Salida</TableHead>
                      <TableHead>Horas Trabajadas</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendanceRecords.slice(0, 20).map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {record.employee?.firstName} {record.employee?.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.employee?.employeeCode} • {record.employee?.department}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>{record.checkIn || '-'}</TableCell>
                        <TableCell>{record.checkOut || '-'}</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{record.workedHours}h</span>
                            {record.overtimeHours > 0 && (
                              <span className="text-sm text-blue-600 ml-2">
                                +{record.overtimeHours}h extra
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={record.notes || ''}>
                            {record.notes || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Solicitudes de Permisos */}
        <TabsContent value="requests" className="space-y-4">
          {/* Filtros de Solicitudes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Solicitudes
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Buscar empleado..."
                value={requestFilters.search}
                onChange={(e) => setRequestFilters(prev => ({...prev, search: e.target.value}))}
              />
              
              <Select 
                value={requestFilters.type} 
                onValueChange={(value) => setRequestFilters(prev => ({...prev, type: value as RequestType}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de solicitud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {Object.entries(REQUEST_TYPE).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.icon} {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={requestFilters.status} 
                onValueChange={(value) => setRequestFilters(prev => ({...prev, status: value as RequestStatus}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(REQUEST_STATUS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => setRequestFilters({search: '', type: 'all', status: 'all', employeeId: 'all'})}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>

          {/* Tabla de Solicitudes */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Permisos ({filteredRequests.length})</CardTitle>
              <CardDescription>
                Gestión de solicitudes de vacaciones, permisos e incapacidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fechas</TableHead>
                      <TableHead>Días</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Solicitado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {request.employee?.firstName} {request.employee?.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.employee?.employeeCode} • {request.employee?.department}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRequestTypeBadge(request.type)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(request.startDate)}</div>
                            <div className="text-muted-foreground">
                              al {formatDate(request.endDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.totalDays} días</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </TableCell>
                        <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                        <TableCell>{formatDate(request.requestedAt.split('T')[0])}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === 'PENDING' && (
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Reportes */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes de Asistencia</CardTitle>
              <CardDescription>
                Análisis y estadísticas detalladas del comportamiento de asistencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Módulo de Reportes</h3>
                <p className="text-muted-foreground mb-4">
                  Esta sección incluirá gráficos y análisis avanzados de asistencias
                </p>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 