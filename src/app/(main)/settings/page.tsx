'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, User, Building, Lock, Bell, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  // Company Settings State
  const [companySettings, setCompanySettings] = useState({
    name: 'Mi Empresa S.A. de C.V.',
    nit: '1234-123456-123-4',
    address: 'San Salvador, El Salvador',
    phone: '+503 2222-3333',
    email: 'info@miempresa.com',
    website: 'www.miempresa.com'
  });

  // Payroll Settings State
  const [payrollSettings, setPayrollSettings] = useState({
    currency: 'USD',
    payPeriod: 'MONTHLY',
    cutoffDay: 30,
    payDay: 5,
    overtimeRate: 1.5,
    nightShiftRate: 1.25,
    holidayRate: 2.0
  });

  // User Preferences State
  const [userPreferences, setUserPreferences] = useState({
    language: 'es',
    timezone: 'America/El_Salvador',
    dateFormat: 'DD/MM/YYYY',
    theme: 'system'
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  });

  function handleSave() {
    // Aquí se guardarían las configuraciones
    console.log('Guardando configuraciones:', {
      company: companySettings,
      payroll: payrollSettings,
      user: userPreferences,
      security: securitySettings
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground">
            Administrar configuraciones de empresa, nómina y preferencias del usuario
          </p>
        </div>
      </div>

      {saved && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✓ Configuraciones guardadas exitosamente
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Nómina
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Usuario
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>
                Configuración básica de la empresa y datos fiscales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Razón Social</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="nit">NIT</Label>
                  <Input
                    id="nit"
                    value={companySettings.nit}
                    onChange={(e) => setCompanySettings({...companySettings, nit: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Settings */}
        <TabsContent value="payroll" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Nómina</CardTitle>
                <CardDescription>
                  Parámetros básicos para el cálculo de nómina
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <Select value={payrollSettings.currency} onValueChange={(value) => setPayrollSettings({...payrollSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payPeriod">Período de Pago</Label>
                  <Select value={payrollSettings.payPeriod} onValueChange={(value) => setPayrollSettings({...payrollSettings, payPeriod: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Semanal</SelectItem>
                      <SelectItem value="BIWEEKLY">Quincenal</SelectItem>
                      <SelectItem value="MONTHLY">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cutoffDay">Día de Corte</Label>
                    <Input
                      id="cutoffDay"
                      type="number"
                      min="1"
                      max="31"
                      value={payrollSettings.cutoffDay}
                      onChange={(e) => setPayrollSettings({...payrollSettings, cutoffDay: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payDay">Día de Pago</Label>
                    <Input
                      id="payDay"
                      type="number"
                      min="1"
                      max="31"
                      value={payrollSettings.payDay}
                      onChange={(e) => setPayrollSettings({...payrollSettings, payDay: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tarifas y Multiplicadores</CardTitle>
                <CardDescription>
                  Configuración de horas extras y recargos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="overtimeRate">Tarifa Horas Extras</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="overtimeRate"
                      type="number"
                      step="0.1"
                      min="1"
                      max="3"
                      value={payrollSettings.overtimeRate}
                      onChange={(e) => setPayrollSettings({...payrollSettings, overtimeRate: parseFloat(e.target.value)})}
                    />
                    <Badge variant="outline">x{payrollSettings.overtimeRate}</Badge>
                  </div>
                </div>

                <div>
                  <Label htmlFor="nightShiftRate">Recargo Nocturno</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="nightShiftRate"
                      type="number"
                      step="0.1"
                      min="1"
                      max="2"
                      value={payrollSettings.nightShiftRate}
                      onChange={(e) => setPayrollSettings({...payrollSettings, nightShiftRate: parseFloat(e.target.value)})}
                    />
                    <Badge variant="outline">x{payrollSettings.nightShiftRate}</Badge>
                  </div>
                </div>

                <div>
                  <Label htmlFor="holidayRate">Recargo Festivos</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="holidayRate"
                      type="number"
                      step="0.1"
                      min="1"
                      max="3"
                      value={payrollSettings.holidayRate}
                      onChange={(e) => setPayrollSettings({...payrollSettings, holidayRate: parseFloat(e.target.value)})}
                    />
                    <Badge variant="outline">x{payrollSettings.holidayRate}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Preferences */}
        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferencias del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={userPreferences.language} onValueChange={(value) => setUserPreferences({...userPreferences, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select value={userPreferences.timezone} onValueChange={(value) => setUserPreferences({...userPreferences, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/El_Salvador">El Salvador (GMT-6)</SelectItem>
                      <SelectItem value="America/Guatemala">Guatemala (GMT-6)</SelectItem>
                      <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateFormat">Formato de Fecha</Label>
                  <Select value={userPreferences.dateFormat} onValueChange={(value) => setUserPreferences({...userPreferences, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                Configuraciones de autenticación y políticas de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="480"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>

                <div>
                  <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    min="30"
                    max="365"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                  />
                </div>

                <div>
                  <Label htmlFor="loginAttempts">Intentos de Login Permitidos</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Guardar Configuraciones
        </Button>
      </div>
    </div>
  );
} 