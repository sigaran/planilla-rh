import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, action, variant = "default" }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prevToasts) => [...prevToasts, { id, title, description, action, variant }])
      return id
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return {
    toasts,
    toast,
    dismiss,
  }
} 