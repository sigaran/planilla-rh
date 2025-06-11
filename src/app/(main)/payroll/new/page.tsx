"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, Save, User } from "lucide-react";
import Link from "next/link";
import { formatCurrency, calculatePayroll, generatePeriodString } from "../utils";
import { PayrollCalculation } from "../types";
import { getEmployees } from "@/lib/employees";
import { Employee } from "../../employees/types";

export default function NewPayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [ordinaryHours, setOrdinaryHours] = useState<number>(176); // 22 días x 8 horas
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [bonifications, setBonifications] = useState<number>(0);
  const [aguinaldo, setAguinaldo] = useState<number>(0);
  const [vacationDays, setVacationDays] = useState<number>(0);
  const [personalLoans, setPersonalLoans] = useState<number>(0);
  const [unionFees, setUnionFees] = useState<number>(0);
  const [privateInsurance, setPrivateInsurance] = useState<number>(0);
  const [cooperativeFees, setCooperativeFees] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);

  const employee = employees.find(emp => emp.id === selectedEmployee);

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

  useEffect(() => {
    if (employee) {
      const calc = calculatePayroll({
        baseSalary: employee.salary,
        ordinaryHours,
        overtimeHours,
        bonifications,
        aguinaldo,
        vacationDays,
        personalLoans,
        unionFees,
        privateInsurance,
        cooperativeFees,
        otherDeductions,
      });
      setCalculation(calc);
    }
  }, [
    employee?.salary,
    ordinaryHours,
    overtimeHours,
    bonifications,
    aguinaldo,
    vacationDays,
    personalLoans,
    unionFees,
    privateInsurance,
    cooperativeFees,
    otherDeductions,
  ]);

  const handleCalculate = () => {
    if (employee) {
      const calc = calculatePayroll({
        baseSalary: employee.salary,
        ordinaryHours,
        overtimeHours,
        bonifications,
        aguinaldo,
        vacationDays,
        personalLoans,
        unionFees,
        privateInsurance,
        cooperativeFees,
        otherDeductions,
      });
      setCalculation(calc);
    }
  };

  const handleSubmit = () => {
    if (!employee || !calculation) return;
    
    // Aquí iría la lógica para guardar la planilla
    alert("Planilla creada exitosamente");
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="text-center">Cargando empleados...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/payroll">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Nueva Planilla</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Empleado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Información del Empleado
              </CardTitle>
              <CardDescription>
                Selecciona el empleado y período de la planilla
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="employee">Empleado</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName} - {emp.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="month">Mes</Label>
                  <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {new Date(2024, i).toLocaleDateString('es-ES', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="year">Año</Label>
                  <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => (
                        <SelectItem key={2022 + i} value={(2022 + i).toString()}>
                          {2022 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Período</Label>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-sm">
                      {generatePeriodString(month, year)}
                    </Badge>
                  </div>
                </div>
              </div>

              {employee && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">DUI</div>
                      <div className="font-mono">{employee.dui}</div>
                    </div>
                    <div>
                      <div className="font-medium">NIT</div>
                      <div className="font-mono">{employee.nit}</div>
                    </div>
                    <div>
                      <div className="font-medium">ISSS</div>
                      <div className="font-mono">{employee.isssNumber}</div>
                    </div>
                    <div>
                      <div className="font-medium">AFP</div>
                      <div>{employee.afpName}</div>
                    </div>
                    <div>
                      <div className="font-medium">Puesto</div>
                      <div>{employee.position}</div>
                    </div>
                    <div>
                      <div className="font-medium">Departamento</div>
                      <div>{employee.department}</div>
                    </div>
                    <div>
                      <div className="font-medium">Salario Base</div>
                      <div className="font-bold">{formatCurrency(employee.salary)}</div>
                    </div>
                    <div>
                      <div className="font-medium">Banco</div>
                      <div>{employee.bankName}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Horas y Compensaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Horas y Compensaciones</CardTitle>
              <CardDescription>
                Ingresa las horas trabajadas y compensaciones adicionales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ordinaryHours">Horas Ordinarias</Label>
                  <Input
                    id="ordinaryHours"
                    type="number"
                    value={ordinaryHours}
                    onChange={(e) => setOrdinaryHours(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="overtimeHours">Horas Extraordinarias</Label>
                  <Input
                    id="overtimeHours"
                    type="number"
                    step="0.5"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="bonifications">Bonificaciones</Label>
                  <Input
                    id="bonifications"
                    type="number"
                    step="0.01"
                    value={bonifications}
                    onChange={(e) => setBonifications(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="aguinaldo">Aguinaldo</Label>
                  <Input
                    id="aguinaldo"
                    type="number"
                    step="0.01"
                    value={aguinaldo}
                    onChange={(e) => setAguinaldo(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="vacationDays">Días de Vacaciones</Label>
                  <Input
                    id="vacationDays"
                    type="number"
                    step="0.5"
                    value={vacationDays}
                    onChange={(e) => setVacationDays(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deducciones Opcionales */}
          <Card>
            <CardHeader>
              <CardTitle>Deducciones Opcionales</CardTitle>
              <CardDescription>
                Deducciones adicionales autorizadas por el empleado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personalLoans">Préstamos Personales</Label>
                  <Input
                    id="personalLoans"
                    type="number"
                    step="0.01"
                    value={personalLoans}
                    onChange={(e) => setPersonalLoans(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="unionFees">Cuotas Sindicales</Label>
                  <Input
                    id="unionFees"
                    type="number"
                    step="0.01"
                    value={unionFees}
                    onChange={(e) => setUnionFees(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="privateInsurance">Seguros Privados</Label>
                  <Input
                    id="privateInsurance"
                    type="number"
                    step="0.01"
                    value={privateInsurance}
                    onChange={(e) => setPrivateInsurance(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="cooperativeFees">Cuotas Cooperativas</Label>
                  <Input
                    id="cooperativeFees"
                    type="number"
                    step="0.01"
                    value={cooperativeFees}
                    onChange={(e) => setCooperativeFees(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="otherDeductions">Otras Deducciones</Label>
                  <Input
                    id="otherDeductions"
                    type="number"
                    step="0.01"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Cálculos */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Cálculo de Planilla
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {calculation && employee ? (
                <>
                  {/* Ingresos */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">INGRESOS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Salario Base</span>
                        <span className="font-medium">{formatCurrency(calculation.baseSalary)}</span>
                      </div>
                      {calculation.overtimeAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Horas Extra ({overtimeHours}h)</span>
                          <span className="font-medium">{formatCurrency(calculation.overtimeAmount)}</span>
                        </div>
                      )}
                      {calculation.bonifications > 0 && (
                        <div className="flex justify-between">
                          <span>Bonificaciones</span>
                          <span className="font-medium">{formatCurrency(calculation.bonifications)}</span>
                        </div>
                      )}
                      {calculation.aguinaldo > 0 && (
                        <div className="flex justify-between">
                          <span>Aguinaldo</span>
                          <span className="font-medium">{formatCurrency(calculation.aguinaldo)}</span>
                        </div>
                      )}
                      {calculation.vacationAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Vacaciones ({vacationDays} días)</span>
                          <span className="font-medium">{formatCurrency(calculation.vacationAmount)}</span>
                        </div>
                      )}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total Bruto</span>
                      <span className="text-green-600">{formatCurrency(calculation.grossSalary)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Deducciones Obligatorias */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">DEDUCCIONES OBLIGATORIAS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>AFP (7.25%)</span>
                        <span className="font-medium text-red-600">{formatCurrency(calculation.afpEmployee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ISSS (3%)</span>
                        <span className="font-medium text-red-600">{formatCurrency(calculation.isssEmployee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Renta (ISR)</span>
                        <span className="font-medium text-red-600">{formatCurrency(calculation.rentTax)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deducciones Opcionales */}
                  {(personalLoans + unionFees + privateInsurance + cooperativeFees + otherDeductions) > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">DEDUCCIONES OPCIONALES</h4>
                        <div className="space-y-2 text-sm">
                          {personalLoans > 0 && (
                            <div className="flex justify-between">
                              <span>Préstamos</span>
                              <span className="font-medium text-red-600">{formatCurrency(personalLoans)}</span>
                            </div>
                          )}
                          {unionFees > 0 && (
                            <div className="flex justify-between">
                              <span>Cuotas Sindicales</span>
                              <span className="font-medium text-red-600">{formatCurrency(unionFees)}</span>
                            </div>
                          )}
                          {privateInsurance > 0 && (
                            <div className="flex justify-between">
                              <span>Seguros Privados</span>
                              <span className="font-medium text-red-600">{formatCurrency(privateInsurance)}</span>
                            </div>
                          )}
                          {cooperativeFees > 0 && (
                            <div className="flex justify-between">
                              <span>Cooperativas</span>
                              <span className="font-medium text-red-600">{formatCurrency(cooperativeFees)}</span>
                            </div>
                          )}
                          {otherDeductions > 0 && (
                            <div className="flex justify-between">
                              <span>Otras Deducciones</span>
                              <span className="font-medium text-red-600">{formatCurrency(otherDeductions)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Total Deducciones */}
                  <div className="flex justify-between font-bold">
                    <span>Total Deducciones</span>
                    <span className="text-red-600">{formatCurrency(calculation.totalDeductions)}</span>
                  </div>

                  <Separator />

                  {/* Salario Neto */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Salario Neto</span>
                    <span className="text-green-600">{formatCurrency(calculation.netSalary)}</span>
                  </div>

                  <Separator />

                  {/* Aportes Patronales (Informativo) */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">APORTES PATRONALES</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>AFP (7.75%)</span>
                        <span className="font-medium">{formatCurrency(calculation.afpEmployer)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ISSS (7.5%)</span>
                        <span className="font-medium">{formatCurrency(calculation.isssEmployer)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>INSAFORP (1%)</span>
                        <span className="font-medium">{formatCurrency(calculation.insaforp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="space-y-2 pt-4">
                    <Button onClick={handleCalculate} variant="outline" className="w-full">
                      <Calculator className="mr-2 h-4 w-4" />
                      Recalcular
                    </Button>
                    <Button onClick={handleSubmit} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Planilla
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  Selecciona un empleado para ver los cálculos
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 