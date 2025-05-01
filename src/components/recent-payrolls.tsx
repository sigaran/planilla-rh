"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentPayrolls = [
  {
    id: "1",
    employee: "Juan Pérez",
    amount: "$1,500.00",
    date: "2024-03-15",
    status: "Pagado",
  },
  {
    id: "2",
    employee: "María García",
    amount: "$1,800.00",
    date: "2024-03-15",
    status: "Pagado",
  },
  {
    id: "3",
    employee: "Carlos López",
    amount: "$2,000.00",
    date: "2024-03-15",
    status: "Pagado",
  },
  {
    id: "4",
    employee: "Ana Martínez",
    amount: "$1,600.00",
    date: "2024-03-15",
    status: "Pagado",
  },
  {
    id: "5",
    employee: "Roberto Sánchez",
    amount: "$1,900.00",
    date: "2024-03-15",
    status: "Pagado",
  },
]

export function RecentPayrolls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planillas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPayrolls.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell>{payroll.employee}</TableCell>
                <TableCell>{payroll.amount}</TableCell>
                <TableCell>{payroll.date}</TableCell>
                <TableCell>{payroll.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 