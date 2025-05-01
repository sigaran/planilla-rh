'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/app/routes';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push(routes.dashboard);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redireccionando...</p>
    </div>
  );
}
