import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSessionStore } from '@/store/useSessionStore';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { setSession, setLoading } = useSessionStore();

  useEffect(() => {
    // Actualiza el estado de carga en función del status de la sesión
    setLoading(status === 'loading');

    // Actualiza la sesión en el store
    if (status === 'authenticated') {
      setSession(session);
    } else if (status === 'unauthenticated') {
      setSession(null);
    }
  }, [session, status, setSession, setLoading]);

  return <>{children}</>;
} 