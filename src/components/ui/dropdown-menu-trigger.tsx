"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  asChild?: boolean
}

export function DropdownMenuTrigger({ children, asChild, className, ...props }: DropdownMenuTriggerProps) {
  const Comp = asChild ? React.Fragment : "div"
  return (
    <Comp className={cn("cursor-pointer", className)} {...props}>
      {children}
    </Comp>
  )
} 