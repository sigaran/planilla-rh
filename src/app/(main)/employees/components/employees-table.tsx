"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Phone, Mail } from "lucide-react";
import { type Employee, EMPLOYEE_STATUS } from "../types";

interface EmployeesTableProps {
  employees: Employee[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function EmployeesTable({ employees }: EmployeesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            <TableHead>DUI</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Fecha Ingreso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Salario</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {employee.afpName}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {employee.dui}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-1 h-3 w-3" />
                    {employee.email}
                  </div>
                  {employee.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3" />
                      {employee.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{formatDate(employee.hireDate)}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`text-white ${EMPLOYEE_STATUS[employee.status].color}`}
                >
                  {EMPLOYEE_STATUS[employee.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(employee.salary)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 