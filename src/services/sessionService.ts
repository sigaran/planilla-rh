export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: SessionUser;
}

// Variable para rastrear si estamos en proceso de cierre de sesión
let isSigningOutInProgress = false;

export const SessionService = {
  /**
   * Establece que estamos en proceso de cierre de sesión
   */
  setSigningOut: (value: boolean) => {
    isSigningOutInProgress = value;
  },

  /**
   * Valida la sesión actual del usuario
   * @returns Una promesa que resuelve con la información de la sesión
   */
  validateSession: async (): Promise<SessionResponse> => {
    // No validar si estamos en proceso de cierre de sesión
    if (isSigningOutInProgress) {
      return { authenticated: false };
    }

    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Error validating session');
      }

      return await response.json();
    } catch (error) {
      console.error('Session validation error:', error);
      return { authenticated: false };
    }
  },
}; 