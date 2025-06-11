'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Send, AlertCircle, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

import { mockEmployees } from '@/lib/employees';
import { 
  REQUEST_TYPE,
  RequestType,
  CreateRequestData 
} from '../types';

export default function AttendanceRequestPage() {
  const router = useRouter();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [formData, setFormData] = useState<CreateRequestData>({
    employeeId: '',
    type: 'VACATION',
    startDate: '',
    endDate: '',
    reason: '',
    comments: '',
    attachments: []
  });

  const [calculatedDays, setCalculatedDays] = useState<number>(0);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [acknowledgment, setAcknowledgment] = useState<boolean>(false);

  const selectedEmployee = mockEmployees?.find(emp => emp.id === selectedEmployeeId);
  const requestTypeInfo = REQUEST_TYPE[formData.type as RequestType];

  // Calcular días automáticamente
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCalculatedDays(diffDays);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  function handleEmployeeSelect(employeeId: string) {
    setSelectedEmployeeId(employeeId);
    setFormData(prev => ({ ...prev, employeeId }));
  }

  function handleInputChange(field: keyof CreateRequestData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleTypeChange(type: RequestType) {
    setFormData(prev => ({ 
      ...prev, 
      type,
      // Auto-fill reason based on type
      reason: getDefaultReason(type)
    }));
  }

  function getDefaultReason(type: RequestType): string {
    const defaults = {
      VACATION: 'Solicitud de vacaciones',
      SICK_LEAVE: 'Incapacidad médica',
      PERSONAL_LEAVE: 'Permiso por asuntos personales',
      MATERNITY: 'Permiso de maternidad',
      PATERNITY: 'Permiso de paternidad',
      STUDY: 'Permiso para estudios',
      OTHER: ''
    };
    return defaults[type] || '';
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    setAttachmentFiles(prev => [...prev, ...files]);
  }

  function removeAttachment(index: number) {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!validateForm()) return;

    // Aquí se enviarían los datos al backend
    const requestData = {
      ...formData,
      totalDays: calculatedDays,
      attachments: attachmentFiles.map(file => file.name) // En producción, se subirían los archivos
    };

    console.log('Enviando solicitud:', requestData);
    
    router.push('/attendance');
  }

  function validateForm(): boolean {
    if (!selectedEmployeeId || !formData.startDate || !formData.endDate || !formData.reason) {
      return false;
    }

    if (calculatedDays > requestTypeInfo.maxDays) {
      return false;
    }

    if (formData.type === 'SICK_LEAVE' && attachmentFiles.length === 0) {
      return false;
    }

    return acknowledgment;
  }

  function getDateLimits() {
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    return {
      minDate: formData.type === 'SICK_LEAVE' ? 
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : // 7 días atrás para incapacidades
        today,
      maxDate: maxDate.toISOString().split('T')[0]
    };
  }

  const dateRange = getDateLimits();
  const isValid = validateForm();
  const exceedsMaxDays = calculatedDays > requestTypeInfo.maxDays;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nueva Solicitud de Permiso</h1>
          <p className="text-muted-foreground">
            Crear solicitud de vacaciones, permisos o incapacidades
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
                <FileText className="h-5 w-5" />
                Información del Solicitante
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
                    {mockEmployees.map((employee) => (
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
                    ))}
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
                      <span className="text-muted-foreground">Fecha de ingreso:</span>
                      <span className="ml-2">{new Date(selectedEmployee.hireDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tipo de Solicitud */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Solicitud</CardTitle>
              <CardDescription>
                Seleccione el tipo de permiso que desea solicitar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="type">Tipo de Permiso</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleTypeChange(value as RequestType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REQUEST_TYPE).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{value.icon}</span>
                          <span>{value.label}</span>
                          <span className="text-sm text-muted-foreground">
                            (máx. {value.maxDays} días)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{requestTypeInfo.label}:</strong> Máximo {requestTypeInfo.maxDays} días por solicitud.
                  {formData.type === 'SICK_LEAVE' && ' Requiere certificado médico.'}
                  {formData.type === 'MATERNITY' && ' Requiere certificado médico y documentación legal.'}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas del Permiso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    min={dateRange.minDate}
                    max={dateRange.maxDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    min={formData.startDate || dateRange.minDate}
                    max={dateRange.maxDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              {calculatedDays > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total de días solicitados:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={exceedsMaxDays ? "destructive" : "default"}>
                        {calculatedDays} días
                      </Badge>
                      {exceedsMaxDays && (
                        <span className="text-sm text-red-600">
                          Excede el máximo permitido ({requestTypeInfo.maxDays})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Motivo y Comentarios */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reason">Motivo de la Solicitud</Label>
                <Textarea
                  id="reason"
                  placeholder="Describa el motivo de su solicitud..."
                  value={formData.reason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('reason', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="comments">Comentarios Adicionales</Label>
                <Textarea
                  id="comments"
                  placeholder="Información adicional que considere relevante..."
                  value={formData.comments || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('comments', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Documentos Adjuntos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Documentos Adjuntos
              </CardTitle>
              <CardDescription>
                {formData.type === 'SICK_LEAVE' && 'Requerido: Certificado médico'}
                {formData.type === 'MATERNITY' && 'Requerido: Certificado médico y documentación'}
                {!['SICK_LEAVE', 'MATERNITY'].includes(formData.type) && 'Opcional: Documentos de soporte'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Formatos aceptados: PDF, JPG, PNG, DOC, DOCX (máx. 5MB por archivo)
                </p>
              </div>

              {attachmentFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Archivos seleccionados:</Label>
                  {attachmentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {formData.type === 'SICK_LEAVE' && attachmentFiles.length === 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Las incapacidades médicas requieren certificado médico adjunto.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel de Resumen */}
        <div className="space-y-6">
          {/* Resumen de la Solicitud */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <div className="mt-1">
                    <Badge variant="outline">
                      <span className="mr-1">{requestTypeInfo.icon}</span>
                      {requestTypeInfo.label}
                    </Badge>
                  </div>
                </div>

                {calculatedDays > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Duración:</span>
                    <div className="mt-1">
                      <Badge variant={exceedsMaxDays ? "destructive" : "default"}>
                        {calculatedDays} días
                      </Badge>
                    </div>
                  </div>
                )}

                {formData.startDate && formData.endDate && (
                  <div>
                    <span className="text-sm text-muted-foreground">Período:</span>
                    <div className="mt-1 text-sm">
                      {new Date(formData.startDate).toLocaleDateString('es-ES')} al{' '}
                      {new Date(formData.endDate).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                )}

                {attachmentFiles.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Documentos:</span>
                    <div className="mt-1">
                      <Badge variant="outline">{attachmentFiles.length} archivo(s)</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Confirmación */}
          <Card>
            <CardHeader>
              <CardTitle>Confirmación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="acknowledgment"
                  checked={acknowledgment}
                  onCheckedChange={(checked) => setAcknowledgment(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="acknowledgment"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Declaro que la información proporcionada es verdadera
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Entiendo que esta solicitud estará sujeta a aprobación y que cualquier 
                    información falsa puede resultar en medidas disciplinarias.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={!isValid}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitud
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => router.back()}>
                  Cancelar
                </Button>

                {!isValid && (
                  <div className="text-xs text-muted-foreground">
                    Complete todos los campos requeridos para enviar la solicitud.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 