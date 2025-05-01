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

const benefits = [
  {
    id: "1",
    employee: "Juan Pérez",
    type: "HEALTH_INSURANCE",
    amount: 200.00,
    description: "Seguro médico familiar",
    startDate: "2024-01-01",
    endDate: null,
  },
  {
    id: "2",
    employee: "María García",
    type: "LIFE_INSURANCE",
    amount: 150.00,
    description: "Seguro de vida",
    startDate: "2024-01-01",
    endDate: null,
  },
  {
    id: "3",
    employee: "Carlos López",
    type: "BONUS",
    amount: 500.00,
    description: "Bono de productividad",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: "4",
    employee: "Ana Martínez",
    type: "ALLOWANCE",
    amount: 300.00,
    description: "Subsidio de transporte",
    startDate: "2024-01-01",
    endDate: null,
  },
];

const typeColors = {
  HEALTH_INSURANCE: "bg-blue-500",
  LIFE_INSURANCE: "bg-green-500",
  BONUS: "bg-yellow-500",
  ALLOWANCE: "bg-purple-500",
  OTHER: "bg-gray-500",
};

export default function BenefitsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Beneficios</h2>
        <div className="flex items-center space-x-2">
          <Link href="/benefits/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Beneficio
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
            {benefits.map((benefit) => (
              <TableRow key={benefit.id}>
                <TableCell className="font-medium">{benefit.employee}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={typeColors[benefit.type as keyof typeof typeColors]}
                  >
                    {benefit.type}
                  </Badge>
                </TableCell>
                <TableCell>{benefit.description}</TableCell>
                <TableCell className="text-right">
                  ${benefit.amount.toFixed(2)}
                </TableCell>
                <TableCell>{benefit.startDate}</TableCell>
                <TableCell>{benefit.endDate || "Indefinido"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 