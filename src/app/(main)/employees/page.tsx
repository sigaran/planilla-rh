import { EmployeesTable } from "./components/employees-table";
import { getEmployees } from "@/lib/employees";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function EmployeesPage() {
  const employees = await getEmployees();
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