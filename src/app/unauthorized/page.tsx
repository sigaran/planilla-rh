'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from '@/i18n/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Acceso No Autorizado</h1>
      <p className="text-gray-500">
        Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
      </p>
      <Button onClick={() => router.push('/')}>
        Volver al inicio
      </Button>
    </div>
  );
} 