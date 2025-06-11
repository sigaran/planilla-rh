"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Eye, FileText, Download, Filter, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency, getMonthName } from "./utils";
import { PAYROLL_STATUS } from "./types";

// Datos de ejemplo actualizados para El Salvador
const allPayrolls = [
  {
    id: "1",
    employee: {
      firstName: "Juan Carlos",
      lastName: "Pérez Hernández",
      dui: "12345678-9",
      position: "Desarrollador Senior"
    },
    period: "Marzo 2024",
    month: 3,
    year: 2024,
    baseSalary: 2500.00,
    overtimeHours: 8,
    overtimeAmount: 227.27,
    bonifications: 100.00,
    aguinaldo: 0.00,
    grossSalary: 2827.27,
    afpEmployeeAmount: 204.98,
    isssEmployeeAmount: 84.82,
    rentTax: 423.45,
    totalDeductions: 763.25,
    netSalary: 2064.02,
    status: "PAID",
  },
  {
    id: "2",
    employee: {
      firstName: "María Elena",
      lastName: "García López",
      dui: "98765432-1",
      position: "Contadora"
    },
    period: "Marzo 2024",
    month: 3,
    year: 2024,
    baseSalary: 2800.00,
    overtimeHours: 4,
    overtimeAmount: 127.27,
    bonifications: 200.00,
    aguinaldo: 0.00,
    grossSalary: 3127.27,
    afpEmployeeAmount: 226.73,
    isssEmployeeAmount: 93.82,
    rentTax: 513.05,
    totalDeductions: 883.60,
    netSalary: 2243.67,
    status: "PENDING",
  },
  {
    id: "3",
    employee: {
      firstName: "Carlos Antonio",
      lastName: "López Martínez",
      dui: "11122233-4",
      position: "Analista de Sistemas"
    },
    period: "Febrero 2024",
    month: 2,
    year: 2024,
    baseSalary: 2200.00,
    overtimeHours: 6,
    overtimeAmount: 150.00,
    bonifications: 50.00,
    aguinaldo: 0.00,
    grossSalary: 2400.00,
    afpEmployeeAmount: 174.00,
    isssEmployeeAmount: 72.00,
    rentTax: 335.71,
    totalDeductions: 631.71,
    netSalary: 1768.29,
    status: "APPROVED",
  },
  {
    id: "4",
    employee: {
      firstName: "Ana Sofía",
      lastName: "Martínez Vásquez",
      dui: "55566677-8",
      position: "Gerente de Recursos Humanos"
    },
    period: "Enero 2024",
    month: 1,
    year: 2024,
    baseSalary: 3200.00,
    overtimeHours: 2,
    overtimeAmount: 145.45,
    bonifications: 300.00,
    aguinaldo: 0.00,
    grossSalary: 3645.45,
    afpEmployeeAmount: 264.29,
    isssEmployeeAmount: 109.36,
    rentTax: 672.09,
    totalDeductions: 1095.74,
    netSalary: 2549.71,
    status: "PAID",
  },
  {
    id: "5",
    employee: {
      firstName: "Roberto",
      lastName: "González Herrera",
      dui: "99988877-6",
      position: "Diseñador UX/UI"
    },
    period: "Enero 2024",
    month: 1,
    year: 2024,
    baseSalary: 2300.00,
    overtimeHours: 10,
    overtimeAmount: 261.36,
    bonifications: 75.00,
    aguinaldo: 0.00,
    grossSalary: 2636.36,
    afpEmployeeAmount: 191.14,
    isssEmployeeAmount: 79.09,
    rentTax: 406.82,
    totalDeductions: 727.05,
    netSalary: 1909.31,
    status: "APPROVED",
  },
];

export default function PayrollPage() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Obtener años únicos de las planillas
  const availableYears = [...new Set(allPayrolls.map(p => p.year))].sort((a, b) => b - a);
  
  // Filtrar planillas según los filtros seleccionados
  const filteredPayrolls = allPayrolls.filter(payroll => {
    const monthMatch = selectedMonth === "all" || payroll.month.toString() === selectedMonth;
    const yearMatch = selectedYear === "all" || payroll.year.toString() === selectedYear;
    const statusMatch = selectedStatus === "all" || payroll.status === selectedStatus;
    
    return monthMatch && yearMatch && statusMatch;
  });

  const handleViewPayroll = (payrollId: string) => {
    router.push(`/payroll/${payrollId}`);
  };

  const clearFilters = () => {
    setSelectedMonth("all");
    setSelectedYear("all");
    setSelectedStatus("all");
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Planillas de Pago</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar Reporte
          </Button>
          <Link href="/payroll/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Planilla
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Label className="text-sm font-medium">Filtros:</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="month" className="text-sm">Mes:</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los meses</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {getMonthName(i + 1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="year" className="text-sm">Año:</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="status" className="text-sm">Estado:</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="APPROVED">Aprobado</SelectItem>
                  <SelectItem value="PAID">Pagado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedMonth !== "all" || selectedYear !== "all" || selectedStatus !== "all") && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>DUI</TableHead>
              <TableHead>Período</TableHead>
              <TableHead className="text-right">Salario Base</TableHead>
              <TableHead className="text-right">Horas Extra</TableHead>
              <TableHead className="text-right">Salario Bruto</TableHead>
              <TableHead className="text-right">Total Deducciones</TableHead>
              <TableHead className="text-right">Salario Neto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayrolls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center space-y-2">
                    <Calendar className="h-8 w-8" />
                    <div>No se encontraron planillas con los filtros seleccionados</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayrolls.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {payroll.employee.firstName} {payroll.employee.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payroll.employee.position}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {payroll.employee.dui}
                  </TableCell>
                  <TableCell>{payroll.period}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payroll.baseSalary)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div>{payroll.overtimeHours}h</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(payroll.overtimeAmount)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payroll.grossSalary)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatCurrency(payroll.totalDeductions)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    {formatCurrency(payroll.netSalary)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-white ${PAYROLL_STATUS[payroll.status as keyof typeof PAYROLL_STATUS].color}`}
                    >
                      {PAYROLL_STATUS[payroll.status as keyof typeof PAYROLL_STATUS].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPayroll(payroll.id)}
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Descargar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Empleados</div>
          <div className="text-2xl font-bold">{filteredPayrolls.length}</div>
          {filteredPayrolls.length !== allPayrolls.length && (
            <div className="text-xs text-muted-foreground">
              de {allPayrolls.length} total
            </div>
          )}
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Salario Bruto Total</div>
          <div className="text-2xl font-bold">
            {formatCurrency(filteredPayrolls.reduce((total, p) => total + p.grossSalary, 0))}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Deducciones</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(filteredPayrolls.reduce((total, p) => total + p.totalDeductions, 0))}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Salario Neto Total</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(filteredPayrolls.reduce((total, p) => total + p.netSalary, 0))}
          </div>
        </div>
      </div>
    </div>
  );
} 