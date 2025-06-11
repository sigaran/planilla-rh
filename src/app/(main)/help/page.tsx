'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle, Book, MessageCircle, Phone, Mail, Download, ExternalLink, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const quickActions = [
    {
      title: 'Registrar Empleado',
      description: 'Cómo agregar un nuevo empleado al sistema',
      icon: <Book className="h-5 w-5" />,
      href: '#employees'
    },
    {
      title: 'Calcular Nómina',
      description: 'Proceso paso a paso para generar nómina',
      icon: <Book className="h-5 w-5" />,
      href: '#payroll'
    },
    {
      title: 'Gestionar Asistencias',
      description: 'Registrar y controlar asistencias de empleados',
      icon: <Book className="h-5 w-5" />,
      href: '#attendance'
    },
    {
      title: 'Configurar Sistema',
      description: 'Ajustar configuraciones básicas del sistema',
      icon: <Book className="h-5 w-5" />,
      href: '#settings'
    }
  ];

  const faqs = [
    {
      question: '¿Cómo registro un nuevo empleado?',
      answer: 'Para registrar un nuevo empleado, ve a la sección "Empleados" > "Nuevo Empleado". Completa toda la información requerida incluyendo datos personales, información laboral y datos de contacto de emergencia.',
      category: 'employees'
    },
    {
      question: '¿Cómo calculo las horas extras?',
      answer: 'Las horas extras se calculan automáticamente cuando un empleado trabaja más de 8 horas diarias o 40 horas semanales. La tarifa se configura en Configuración > Nómina > Tarifas.',
      category: 'payroll'
    },
    {
      question: '¿Qué documentos necesito para registrar empleados en El Salvador?',
      answer: 'Necesitas: DUI, NIT, número de ISSS, número de AFP, y información del AFP elegido. Todos estos son obligatorios según la legislación salvadoreña.',
      category: 'employees'
    },
    {
      question: '¿Cómo funcionan las solicitudes de permisos?',
      answer: 'Los empleados pueden solicitar permisos desde Asistencias > Solicitudes. Los tipos incluyen vacaciones, incapacidades médicas, permisos personales, maternidad/paternidad y permisos de estudio.',
      category: 'attendance'
    },
    {
      question: '¿Puedo exportar los reportes de nómina?',
      answer: 'Sí, todos los reportes se pueden exportar en formato PDF y Excel desde la sección correspondiente. También puedes programar reportes automáticos.',
      category: 'payroll'
    },
    {
      question: '¿Cómo configuro las tasas de descuentos legales?',
      answer: 'Ve a Configuración > Nómina y ajusta las tasas de ISSS, AFP, y otros descuentos según las regulaciones vigentes en El Salvador.',
      category: 'settings'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      employees: 'Empleados',
      payroll: 'Nómina',
      attendance: 'Asistencias',
      settings: 'Configuración'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Centro de Ayuda</h1>
          <p className="text-muted-foreground">
            Documentación, tutoriales y soporte para el sistema de planillas
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar en la documentación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Primeros Pasos</TabsTrigger>
          <TabsTrigger value="guides">Guías</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="support">Soporte</TabsTrigger>
        </TabsList>

        {/* Getting Started */}
        <TabsContent value="getting-started" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {action.icon}
                    {action.title}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuración Inicial</CardTitle>
              <CardDescription>Pasos esenciales para comenzar a usar el sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">Configurar información de la empresa</p>
                    <p className="text-sm text-muted-foreground">Ve a Configuración &gt; Empresa y completa los datos fiscales</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Configurar parámetros de nómina</p>
                    <p className="text-sm text-muted-foreground">Ajusta períodos de pago, tasas y multiplicadores</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Registrar empleados</p>
                    <p className="text-sm text-muted-foreground">Agrega la información completa de todos los empleados</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium">Comenzar a registrar asistencias</p>
                    <p className="text-sm text-muted-foreground">Usa el módulo de asistencias para el control diario</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guides */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Gestión de Empleados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Registro de Empleados</p>
                    <p className="text-sm text-muted-foreground">Agregar nuevos empleados con toda la documentación</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Gestión de Documentos</p>
                    <p className="text-sm text-muted-foreground">Subir y administrar documentos de empleados</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Estados de Empleados</p>
                    <p className="text-sm text-muted-foreground">Manejar altas, bajas y cambios de estado</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Control de Asistencias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Registro Manual de Asistencias</p>
                    <p className="text-sm text-muted-foreground">Cómo registrar entradas y salidas manualmente</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Solicitudes de Permisos</p>
                    <p className="text-sm text-muted-foreground">Proceso de solicitud y aprobación de permisos</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Reportes de Asistencia</p>
                    <p className="text-sm text-muted-foreground">Generar y exportar reportes de asistencia</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Cálculo de Nómina
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Proceso de Nómina</p>
                    <p className="text-sm text-muted-foreground">Pasos para calcular y generar nómina</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Descuentos Legales</p>
                    <p className="text-sm text-muted-foreground">ISSS, AFP y otros descuentos obligatorios</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Horas Extras y Recargos</p>
                    <p className="text-sm text-muted-foreground">Cálculo de overtime y recargos nocturnos</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Reportes y Exportación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Reportes de Nómina</p>
                    <p className="text-sm text-muted-foreground">Generar reportes detallados de nómina</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Exportación de Datos</p>
                    <p className="text-sm text-muted-foreground">Exportar datos en Excel y PDF</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="text-left">
                    <p className="font-medium">Reportes Automáticos</p>
                    <p className="text-sm text-muted-foreground">Configurar reportes programados</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
              <CardDescription>
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Respuestas a las consultas más comunes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{faq.question}</span>
                        <Badge variant="outline">
                          {getCategoryLabel(faq.category)}
                        </Badge>
                      </div>
                      {expandedFaq === index ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="p-4 pt-0 border-t">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {filteredFaqs.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No se encontraron resultados para "{searchQuery}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Contactar Soporte
                </CardTitle>
                <CardDescription>Obtén ayuda personalizada de nuestro equipo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start gap-3">
                  <Mail className="h-4 w-4" />
                  soporte@planillas.com
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Phone className="h-4 w-4" />
                  +503 2222-3333
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <MessageCircle className="h-4 w-4" />
                  Chat en Vivo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Recursos Adicionales
                </CardTitle>
                <CardDescription>Documentación y materiales complementarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-between">
                  Manual de Usuario (PDF)
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Guía de Configuración
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Videos Tutoriales
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
              <CardDescription>Detalles técnicos y versión actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Versión del Sistema</p>
                  <p className="text-muted-foreground">v1.0.0</p>
                </div>
                <div>
                  <p className="font-medium">Última Actualización</p>
                  <p className="text-muted-foreground">15 de Enero, 2024</p>
                </div>
                <div>
                  <p className="font-medium">Estado del Servicio</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">Operativo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 