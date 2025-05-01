"use client";

import { EmployeeForm } from "../components/employee-form";

export default function NewEmployeePage() {
  async function handleSubmit(data: any) {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          name: `${data.firstName} ${data.lastName}`,
          salary: parseFloat(data.salary),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el empleado");
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Nuevo Empleado</h2>
      </div>
      <div className="grid gap-6">
        <EmployeeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 