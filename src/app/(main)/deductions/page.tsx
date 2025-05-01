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

const deductions = [
  {
    id: "1",
    employee: "Juan Pérez",
    type: "TAX",
    amount: 300.00,
    description: "Impuesto sobre la renta",
    startDate: "2024-01-01",
    endDate: null,
  },
  {
    id: "2",
    employee: "María García",
    type: "INSURANCE",
    amount: 150.00,
    description: "Seguro médico",
    startDate: "2024-01-01",
    endDate: null,
  },
  {
    id: "3",
    employee: "Carlos López",
    type: "LOAN",
    amount: 200.00,
    description: "Préstamo personal",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: "4",
    employee: "Ana Martínez",
    type: "OTHER",
    amount: 100.00,
    description: "Cuota sindical",
    startDate: "2024-01-01",
    endDate: null,
  },
];

const typeColors = {
  TAX: "bg-red-500",
  INSURANCE: "bg-blue-500",
  LOAN: "bg-yellow-500",
  OTHER: "bg-gray-500",
};

export default function DeductionsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Deducciones</h2>
        <div className="flex items-center space-x-2">
          <Link href="/deductions/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Deducción
            </Button>
          </Link>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deductions.map((deduction) => (
              <TableRow key={deduction.id}>
                <TableCell className="font-medium">{deduction.employee}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={typeColors[deduction.type as keyof typeof typeColors]}
                  >
                    {deduction.type}
                  </Badge>
                </TableCell>
                <TableCell>{deduction.description}</TableCell>
                <TableCell className="text-right">
                  ${deduction.amount.toFixed(2)}
                </TableCell>
                <TableCell>{deduction.startDate}</TableCell>
                <TableCell>{deduction.endDate || "Indefinido"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 