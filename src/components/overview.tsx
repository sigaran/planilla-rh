"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Receipt, Gift } from "lucide-react"

const stats = [
  {
    title: "Total Empleados",
    value: "0",
    icon: Users,
  },
  {
    title: "Total Planillas",
    value: "0",
    icon: Receipt,
  },
  {
    title: "Total Deducciones",
    value: "$0.00",
    icon: DollarSign,
  },
  {
    title: "Total Beneficios",
    value: "$0.00",
    icon: Gift,
  },
]

export function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 