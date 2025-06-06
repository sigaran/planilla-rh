// src/lib/employees.ts
import { prisma } from "./prisma";
import { Employee, EmployeeStatus } from "../app/(main)/employees/types";

export async function getEmployees(): Promise<Employee[]> {
  const rawEmployees = await prisma.employee.findMany();

  return rawEmployees.map((e) => ({
    id: e.id,
    firstName: e.firstName,
    lastName: e.lastName,
    email: e.email,
    position: e.position,
    department: e.department,
    status: e.status as EmployeeStatus, // 👈 conversión explícita
    salary: e.salary,
    hireDate: e.hireDate.toISOString(),
    phoneNumber: e.phone ?? undefined,
    address: e.address ?? undefined,
  }));
}
