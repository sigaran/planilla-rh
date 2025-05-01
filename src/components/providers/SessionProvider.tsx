'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { SessionProvider as NextAuthSessionProvider, useSession, signOut } from 'next-auth/react';
import { useSessionStore } from '@/store/useSessionStore';
import { SessionService } from '@/services/sessionService';

// Session state synchronizer
function SessionSync() {
  const { data: session, status } = useSession();
  const { setSession, setLoading } = useSessionStore();
  const validationInProgress = useRef(false);
  const isSigningOut = useRef(false);

  useEffect(() => {
    // Si está en proceso de cierre de sesión, no realizar validaciones
    if (status === 'unauthenticated' && isSigningOut.current) {
      isSigningOut.current = false;
      return;
    }

    // Detectar cambio de autenticado a no autenticado (posible cierre de sesión)
    if (status === 'unauthenticated' && session === null) {
      isSigningOut.current = true;
      setSession(null);
      return;
    }

    // Actualiza el estado de carga en función del status de la sesión
    setLoading(status === 'loading');

    // Actualiza la sesión en el store
    if (status === 'authenticated' && session) {
      setSession(session);
      
      // Verificar la validez de la sesión en el servidor solo si no hay una validación en curso
      // y no estamos en proceso de cierre de sesión
      if (!validationInProgress.current && !isSigningOut.current) {
        const validateServerSession = async () => {
          try {
            validationInProgress.current = true;
            const sessionResponse = await SessionService.validateSession();
            
            if (!sessionResponse.authenticated) {
              // Si la sesión no es válida en el servidor, cerrar sesión en el cliente
              console.warn('Server session validation failed, signing out');
              isSigningOut.current = true;
              setSession(null);
              await signOut({ redirect: false });
            }
          } catch (error) {
            console.error('Error validating session:', error);
          } finally {
            validationInProgress.current = false;
          }
        };
        
        validateServerSession();
      }
    } else if (status === 'unauthenticated') {
      setSession(null);
    }
  }, [session, status, setSession, setLoading]);

  return null;
}

// Combined provider that includes both NextAuth's SessionProvider and our sync component
export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SessionSync />
      {children}
    </NextAuthSessionProvider>
  );
} 