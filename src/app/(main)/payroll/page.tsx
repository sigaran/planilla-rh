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
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const payrolls = [
  {
    id: "1",
    employee: "Juan Pérez",
    period: "Marzo 2024",
    baseSalary: 2500.00,
    overtime: 200.00,
    bonuses: 100.00,
    deductions: 300.00,
    netSalary: 2500.00,
    status: "PAID",
  },
  {
    id: "2",
    employee: "María García",
    period: "Marzo 2024",
    baseSalary: 2800.00,
    overtime: 150.00,
    bonuses: 200.00,
    deductions: 350.00,
    netSalary: 2800.00,
    status: "PENDING",
  },
  {
    id: "3",
    employee: "Carlos López",
    period: "Marzo 2024",
    baseSalary: 2200.00,
    overtime: 100.00,
    bonuses: 50.00,
    deductions: 250.00,
    netSalary: 2100.00,
    status: "APPROVED",
  },
  {
    id: "4",
    employee: "Ana Martínez",
    period: "Marzo 2024",
    baseSalary: 3000.00,
    overtime: 300.00,
    bonuses: 250.00,
    deductions: 400.00,
    netSalary: 3150.00,
    status: "PAID",
  },
];

const statusColors = {
  PAID: "bg-green-500",
  PENDING: "bg-yellow-500",
  APPROVED: "bg-blue-500",
  CANCELLED: "bg-red-500",
};

export default function PayrollPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Planillas</h2>
        <div className="flex items-center space-x-2">
          <Link href="/payroll/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Planilla
            </Button>
          </Link>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Período</TableHead>
              <TableHead className="text-right">Salario Base</TableHead>
              <TableHead className="text-right">Horas Extra</TableHead>
              <TableHead className="text-right">Bonificaciones</TableHead>
              <TableHead className="text-right">Deducciones</TableHead>
              <TableHead className="text-right">Salario Neto</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell className="font-medium">{payroll.employee}</TableCell>
                <TableCell>{payroll.period}</TableCell>
                <TableCell className="text-right">
                  ${payroll.baseSalary.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${payroll.overtime.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${payroll.bonuses.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${payroll.deductions.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${payroll.netSalary.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[payroll.status as keyof typeof statusColors]}
                  >
                    {payroll.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 