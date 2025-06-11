"use client";

import { useState, useEffect } from "react";
import { EmployeesTable } from "./components/employees-table";
import { getEmployees } from "@/lib/employees";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Filter, Users, Search } from "lucide-react";
import Link from "next/link";
import { Employee, EMPLOYEE_STATUS } from "./types";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEmployees();
  }, []);

  // Obtener departamentos únicos
  const availableDepartments = [...new Set(employees.map(emp => emp.department))].sort();
  
  // Filtrar empleados según los filtros seleccionados
  const filteredEmployees = employees.filter(employee => {
    const searchMatch = searchTerm === "" || 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.dui.includes(searchTerm) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const departmentMatch = selectedDepartment === "all" || employee.department === selectedDepartment;
    const statusMatch = selectedStatus === "all" || employee.status === selectedStatus;
    
    return searchMatch && departmentMatch && statusMatch;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedStatus("all");
  };

  // Calcular estadísticas
  const totalSalaries = filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  const averageSalary = filteredEmployees.length > 0 ? totalSalaries / filteredEmployees.length : 0;

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="text-center">Cargando empleados...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Empleados</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Exportar Lista
          </Button>
          <Link href="/employees/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Label className="text-sm font-medium">Filtros:</Label>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email, DUI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-[250px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="department" className="text-sm">Departamento:</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {availableDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
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
                    {Object.entries(EMPLOYEE_STATUS).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchTerm !== "" || selectedDepartment !== "all" || selectedStatus !== "all") && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EmployeesTable employees={filteredEmployees} />
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Empleados</div>
          <div className="text-2xl font-bold">{filteredEmployees.length}</div>
          {filteredEmployees.length !== employees.length && (
            <div className="text-xs text-muted-foreground">
              de {employees.length} total
            </div>
          )}
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Empleados Activos</div>
          <div className="text-2xl font-bold text-green-600">
            {filteredEmployees.filter(emp => emp.status === 'ACTIVE').length}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Nómina Total</div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalSalaries)}
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Salario Promedio</div>
          <div className="text-2xl font-bold">
            {formatCurrency(averageSalary)}
          </div>
        </div>
      </div>
    </div>
  );
} 