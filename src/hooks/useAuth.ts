'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export interface Workspace {
  id: string;
  name: string;
}

// Hook simplificado de autenticación
export function useAuth() {
  const { status, data: session } = useSession();
  const router = useRouter();

  // Datos de ejemplo para workspaces (puedes eliminar esto más tarde)
  const workspaces: Workspace[] = [];
  const currentWorkspaceId = '';
  const currentWorkspace: Workspace | null = {
    id: '1',
    name: 'Empresa Principal'
  };

  // Función para cambiar de workspace (placeholder)
  const switchWorkspace = (workspaceId: string) => {
    console.log('Cambio de workspace a:', workspaceId);
    router.refresh();
  };

  return {
    status,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
    workspaces,
    currentWorkspaceId,
    currentWorkspace,
    switchWorkspace,
  };
} 