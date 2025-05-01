import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { EmployeesTable } from "./components/employees-table";
import { type Employee } from "./types";

// TODO: Reemplazar con datos reales de la API
const employees: Employee[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    position: "Conductor",
    department: "Servicios",
    status: "ACTIVE",
    salary: 2500.00,
    hireDate: "2023-01-15",
    phoneNumber: "+503 1234-5678",
    address: "San Salvador, El Salvador",
    emergencyContact: {
      name: "María Pérez",
      relationship: "Esposa",
      phone: "+503 8765-4321",
    },
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    position: "Administradora",
    department: "Administración",
    status: "ACTIVE",
    salary: 2800.00,
    hireDate: "2023-02-20",
    phoneNumber: "+503 2345-6789",
    address: "Santa Tecla, El Salvador",
    emergencyContact: {
      name: "Carlos García",
      relationship: "Esposo",
      phone: "+503 9876-5432",
    },
  },
  {
    id: "3",
    name: "Carlos López",
    email: "carlos@example.com",
    position: "Auxiliar",
    department: "Servicios",
    status: "ON_LEAVE",
    salary: 2200.00,
    hireDate: "2023-03-10",
    phoneNumber: "+503 3456-7890",
    address: "Soyapango, El Salvador",
    emergencyContact: {
      name: "Ana López",
      relationship: "Madre",
      phone: "+503 7654-3210",
    },
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@example.com",
    position: "Supervisora",
    department: "Servicios",
    status: "ACTIVE",
    salary: 3000.00,
    hireDate: "2023-04-05",
    phoneNumber: "+503 4567-8901",
    address: "San Miguel, El Salvador",
    emergencyContact: {
      name: "Roberto Martínez",
      relationship: "Esposo",
      phone: "+503 6543-2109",
    },
  },
];

export default function EmployeesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Empleados</h2>
        <div className="flex items-center space-x-2">
          <Link href="/employees/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </Link>
        </div>
      </div>
      <EmployeesTable employees={employees} />
    </div>
  );
} 