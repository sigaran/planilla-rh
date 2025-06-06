import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newEmployee = await prisma.employee.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        position: data.position,
        department: data.department,
        hireDate: new Date(data.hireDate),
        salary: parseFloat(data.salary),
        status: data.status,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Error al crear empleado:", error);
    return NextResponse.json({ error: "Error al crear empleado" }, { status: 500 });
  }
}