"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Edit, FileText, User } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "../utils";
import { PAYROLL_STATUS } from "../types";

// Datos de ejemplo para las planillas
const payrollsData = {
  "1": {
    id: "1",
    period: "Marzo 2024",
    month: 3,
    year: 2024,
    status: "PAID",
    employee: {
      firstName: "Juan Carlos",
      lastName: "Pérez Hernández",
      dui: "12345678-9",
      nit: "0614-123456-123-4",
      isssNumber: "123456789",
      afpNumber: "AFP123456",
      afpName: "AFP Crecer",
      position: "Desarrollador Senior",
      department: "Tecnología",
      birthDate: "1985-06-15",
      gender: "M",
      address: "Col. Escalón, San Salvador",
      bankName: "Banco Agrícola",
      accountNumber: "1234567890",
      paymentMethod: "TRANSFER"
    },
    // Salarios y compensaciones
    baseSalary: 2500.00,
    ordinaryHours: 176,
    overtimeHours: 8,
    overtimeAmount: 227.27,
    bonifications: 100.00,
    aguinaldo: 0.00,
    vacationDays: 0,
    vacationAmount: 0.00,
    otherIncome: 0.00,
    grossSalary: 2827.27,
    
    // Deducciones obligatorias
    afpEmployeeAmount: 204.98,
    isssEmployeeAmount: 84.82,
    rentTax: 423.45,
    
    // Deducciones opcionales
    personalLoans: 50.00,
    unionFees: 0.00,
    privateInsurance: 0.00,
    cooperativeFees: 0.00,
    otherDeductions: 0.00,
    
    totalDeductions: 763.25,
    netSalary: 2064.02,
    
    // Aportes patronales
    afpEmployerAmount: 219.12,
    isssEmployerAmount: 212.05,
    insaforpAmount: 28.27,
    
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  "2": {
    id: "2",
    period: "Marzo 2024",
    month: 3,
    year: 2024,
    status: "PENDING",
    employee: {
      firstName: "María Elena",
      lastName: "García López",
      dui: "98765432-1",
      nit: "0614-987654-321-1",
      isssNumber: "987654321",
      afpNumber: "AFP987654",
      afpName: "AFP Confía",
      position: "Contadora",
      department: "Finanzas",
      birthDate: "1990-03-22",
      gender: "F",
      address: "Col. San Benito, San Salvador",
      bankName: "Banco de América Central",
      accountNumber: "0987654321",
      paymentMethod: "TRANSFER"
    },
    baseSalary: 2800.00,
    ordinaryHours: 176,
    overtimeHours: 4,
    overtimeAmount: 127.27,
    bonifications: 200.00,
    aguinaldo: 0.00,
    vacationDays: 0,
    vacationAmount: 0.00,
    otherIncome: 0.00,
    grossSalary: 3127.27,
    afpEmployeeAmount: 226.73,
    isssEmployeeAmount: 93.82,
    rentTax: 513.05,
    personalLoans: 0.00,
    unionFees: 50.00,
    privateInsurance: 0.00,
    cooperativeFees: 0.00,
    otherDeductions: 0.00,
    totalDeductions: 883.60,
    netSalary: 2243.67,
    afpEmployerAmount: 242.36,
    isssEmployerAmount: 234.55,
    insaforpAmount: 31.27,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  }
};

export default function PayrollDetailPage({ params }: { params: { id: string } }) {
  const payroll = payrollsData[params.id as keyof typeof payrollsData];

  // Si no se encuentra la planilla, mostrar mensaje de error
  if (!payroll) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center space-x-4">
          <Link href="/payroll">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Planilla no encontrada</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              La planilla con ID "{params.id}" no fue encontrada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/payroll">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Planilla - {payroll.period}
            </h2>
            <p className="text-muted-foreground">
              {payroll.employee.firstName} {payroll.employee.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className={`text-white ${PAYROLL_STATUS[payroll.status as keyof typeof PAYROLL_STATUS].color}`}
          >
            {PAYROLL_STATUS[payroll.status as keyof typeof PAYROLL_STATUS].label}
          </Badge>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Empleado */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Información del Empleado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nombre Completo</div>
                  <div className="font-medium">
                    {payroll.employee.firstName} {payroll.employee.lastName}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">DUI</div>
                    <div className="font-mono text-sm">{payroll.employee.dui}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">NIT</div>
                    <div className="font-mono text-sm">{payroll.employee.nit}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">ISSS</div>
                    <div className="font-mono text-sm">{payroll.employee.isssNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">AFP</div>
                    <div className="text-sm">{payroll.employee.afpName}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Puesto</div>
                  <div>{payroll.employee.position}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Departamento</div>
                  <div>{payroll.employee.department}</div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Banco</div>
                  <div>{payroll.employee.bankName}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Cuenta</div>
                  <div className="font-mono text-sm">{payroll.employee.accountNumber}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalle de Planilla */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resumen Financiero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(payroll.grossSalary)}
                </div>
                <div className="text-sm text-muted-foreground">Salario Bruto</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(payroll.totalDeductions)}
                </div>
                <div className="text-sm text-muted-foreground">Total Deducciones</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(payroll.netSalary)}
                </div>
                <div className="text-sm text-muted-foreground">Salario Neto</div>
              </CardContent>
            </Card>
          </div>

          {/* Detalle de Ingresos */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Cantidad/Horas</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Salario Base</TableCell>
                    <TableCell>{payroll.ordinaryHours} horas</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(payroll.baseSalary)}
                    </TableCell>
                  </TableRow>
                  {payroll.overtimeAmount > 0 && (
                    <TableRow>
                      <TableCell className="font-medium">Horas Extraordinarias</TableCell>
                      <TableCell>{payroll.overtimeHours} horas</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payroll.overtimeAmount)}
                      </TableCell>
                    </TableRow>
                  )}
                  {payroll.bonifications > 0 && (
                    <TableRow>
                      <TableCell className="font-medium">Bonificaciones</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payroll.bonifications)}
                      </TableCell>
                    </TableRow>
                  )}
                  {payroll.aguinaldo > 0 && (
                    <TableRow>
                      <TableCell className="font-medium">Aguinaldo</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payroll.aguinaldo)}
                      </TableCell>
                    </TableRow>
                  )}
                  {payroll.vacationAmount > 0 && (
                    <TableRow>
                      <TableCell className="font-medium">Vacaciones</TableCell>
                      <TableCell>{payroll.vacationDays} días</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payroll.vacationAmount)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">Total Bruto</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatCurrency(payroll.grossSalary)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Detalle de Deducciones */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Deducciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Deducciones Obligatorias */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                    DEDUCCIONES OBLIGATORIAS
                  </h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">AFP (7.25%)</TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(payroll.afpEmployeeAmount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">ISSS (3%)</TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(payroll.isssEmployeeAmount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Renta (ISR)</TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(payroll.rentTax)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Deducciones Opcionales */}
                {(payroll.personalLoans + payroll.unionFees + payroll.privateInsurance + 
                  payroll.cooperativeFees + payroll.otherDeductions) > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                        DEDUCCIONES OPCIONALES
                      </h4>
                      <Table>
                        <TableBody>
                          {payroll.personalLoans > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Préstamos Personales</TableCell>
                              <TableCell className="text-right text-red-600">
                                {formatCurrency(payroll.personalLoans)}
                              </TableCell>
                            </TableRow>
                          )}
                          {payroll.unionFees > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Cuotas Sindicales</TableCell>
                              <TableCell className="text-right text-red-600">
                                {formatCurrency(payroll.unionFees)}
                              </TableCell>
                            </TableRow>
                          )}
                          {payroll.privateInsurance > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Seguros Privados</TableCell>
                              <TableCell className="text-right text-red-600">
                                {formatCurrency(payroll.privateInsurance)}
                              </TableCell>
                            </TableRow>
                          )}
                          {payroll.cooperativeFees > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Cuotas Cooperativas</TableCell>
                              <TableCell className="text-right text-red-600">
                                {formatCurrency(payroll.cooperativeFees)}
                              </TableCell>
                            </TableRow>
                          )}
                          {payroll.otherDeductions > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Otras Deducciones</TableCell>
                              <TableCell className="text-right text-red-600">
                                {formatCurrency(payroll.otherDeductions)}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}

                <Separator />

                {/* Total */}
                <Table>
                  <TableBody>
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold">Total Deducciones</TableCell>
                      <TableCell className="text-right font-bold text-red-600">
                        {formatCurrency(payroll.totalDeductions)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold text-lg">Salario Neto a Pagar</TableCell>
                      <TableCell className="text-right font-bold text-lg text-blue-600">
                        {formatCurrency(payroll.netSalary)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Aportes Patronales */}
          <Card>
            <CardHeader>
              <CardTitle>Aportes Patronales (Informativo)</CardTitle>
              <CardDescription>
                Estos costos son responsabilidad del empleador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">AFP Empleador (7.75%)</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(payroll.afpEmployerAmount)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">ISSS Empleador (7.5%)</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(payroll.isssEmployerAmount)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INSAFORP (1%)</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(payroll.insaforpAmount)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">Total Aportes Patronales</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(
                        payroll.afpEmployerAmount + 
                        payroll.isssEmployerAmount + 
                        payroll.insaforpAmount
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 