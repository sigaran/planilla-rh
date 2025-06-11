// src/lib/employees.ts
import { prisma } from "./prisma";
import { Employee, EmployeeStatus } from "../app/(main)/employees/types";

// Mock data - En producción, esto vendría de la base de datos
export const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "Juan Carlos",
    lastName: "Pérez Hernández",
    email: "juan.perez@empresa.sv",
    
    // Documentos de identificación El Salvador
    dui: "12345678-9",
    nit: "0614-123456-123-4",
    isssNumber: "123456789",
    afpNumber: "AFP123456",
    afpName: "AFP Crecer",
    
    // Información personal
    birthDate: "1985-06-15",
    gender: "M",
    phone: "+503 7890-1234",
    address: "Col. Escalón, San Salvador",
    
    // Información laboral
    employeeCode: "EMP001",
    position: "Desarrollador Senior",
    department: "Tecnología",
    hireDate: "2020-01-15",
    salary: 2500.00,
    status: "ACTIVE",
    
    // Información bancaria
    bankName: "Banco Agrícola",
    accountNumber: "1234567890",
    paymentMethod: "TRANSFER",
  },
  {
    id: "2",
    firstName: "María Elena",
    lastName: "García López",
    email: "maria.garcia@empresa.sv",
    
    dui: "98765432-1",
    nit: "0614-987654-321-1",
    isssNumber: "987654321",
    afpNumber: "AFP987654",
    afpName: "AFP Confía",
    
    birthDate: "1990-03-22",
    gender: "F",
    phone: "+503 7654-3210",
    address: "Col. San Benito, San Salvador",
    
    employeeCode: "EMP002",
    position: "Contadora",
    department: "Finanzas",
    hireDate: "2019-08-10",
    salary: 2800.00,
    status: "ACTIVE",
    
    bankName: "Banco de América Central",
    accountNumber: "0987654321",
    paymentMethod: "TRANSFER",
  },
  {
    id: "3",
    firstName: "Carlos Antonio",
    lastName: "López Martínez",
    email: "carlos.lopez@empresa.sv",
    
    dui: "11122233-4",
    nit: "0614-111222-333-4",
    isssNumber: "111222333",
    afpNumber: "AFP111222",
    afpName: "AFP Porvenir",
    
    birthDate: "1988-11-08",
    gender: "M",
    phone: "+503 7111-2233",
    address: "Col. Miralvalle, San Salvador",
    
    employeeCode: "EMP003",
    position: "Analista de Sistemas",
    department: "Tecnología",
    hireDate: "2021-03-01",
    salary: 2200.00,
    status: "ACTIVE",
    
    bankName: "Banco Cuscatlán",
    accountNumber: "1122334455",
    paymentMethod: "TRANSFER",
  },
  {
    id: "4",
    firstName: "Ana Sofía",
    lastName: "Martínez Vásquez",
    email: "ana.martinez@empresa.sv",
    
    dui: "55566677-8",
    nit: "0614-555666-777-8",
    isssNumber: "555666777",
    afpNumber: "AFP555666",
    afpName: "AFP Crecer",
    
    birthDate: "1982-12-03",
    gender: "F",
    phone: "+503 7555-6677",
    address: "Col. Flor Blanca, San Salvador",
    
    employeeCode: "EMP004",
    position: "Gerente de Recursos Humanos",
    department: "Recursos Humanos",
    hireDate: "2018-05-15",
    salary: 3200.00,
    status: "ACTIVE",
    
    bankName: "Banco Agrícola",
    accountNumber: "5566778899",
    paymentMethod: "TRANSFER",
  },
  {
    id: "5",
    firstName: "Roberto",
    lastName: "González Herrera",
    email: "roberto.gonzalez@empresa.sv",
    
    dui: "99988877-6",
    nit: "0614-999888-777-6",
    isssNumber: "999888777",
    afpNumber: "AFP999888",
    afpName: "AFP Confía",
    
    birthDate: "1992-07-18",
    gender: "M",
    phone: "+503 7999-8877",
    address: "Col. San Francisco, San Salvador",
    
    employeeCode: "EMP005",
    position: "Diseñador UX/UI",
    department: "Tecnología",
    hireDate: "2022-01-10",
    salary: 2300.00,
    status: "ACTIVE",
    
    bankName: "Banco de América Central",
    accountNumber: "9988776655",
    paymentMethod: "TRANSFER",
  }
];

export async function getEmployees(): Promise<Employee[]> {
  // En desarrollo, devolvemos los datos mock
  // En producción, esto usaría la base de datos:
  /*
  const rawEmployees = await prisma.employee.findMany();

  return rawEmployees.map((e) => ({
    id: e.id,
    firstName: e.firstName,
    lastName: e.lastName,
    email: e.email,
    
    // Documentos de identificación El Salvador
    dui: e.dui,
    nit: e.nit,
    isssNumber: e.isssNumber,
    afpNumber: e.afpNumber,
    afpName: e.afpName,
    
    // Información personal
    birthDate: e.birthDate.toISOString().split('T')[0],
    gender: e.gender as "M" | "F",
    phone: e.phone ?? undefined,
    address: e.address ?? undefined,
    
    // Información laboral
    position: e.position,
    department: e.department,
    hireDate: e.hireDate.toISOString().split('T')[0],
    endDate: e.endDate ? e.endDate.toISOString().split('T')[0] : undefined,
    salary: e.salary,
    status: e.status as EmployeeStatus,
    
    // Información bancaria
    bankName: e.bankName ?? undefined,
    accountNumber: e.accountNumber ?? undefined,
    paymentMethod: e.paymentMethod as "TRANSFER" | "CHECK" | "CASH",
  }));
  */
  
  return mockEmployees;
}
