import { create } from 'zustand';
import { Session } from 'next-auth';
import { WorkspaceWithRole } from '@/types/next-auth';

// Interfaz para la sesión extendida que esperamos recibir
interface ExtendedSession extends Session {
  user: {
    id: string;
    workspaces: WorkspaceWithRole[];
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

interface SessionState {
  userId: string;
  workspaces: WorkspaceWithRole[];
  currentWorkspaceId: string | null;
  isLoading: boolean;
  
  // Actions
  setSession: (session: Session | null) => void;
  setCurrentWorkspace: (workspaceId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Selectors
  getCurrentWorkspace: () => WorkspaceWithRole | undefined;
  hasAccessToWorkspace: (workspaceId: string) => boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  userId: '',
  workspaces: [],
  currentWorkspaceId: null,
  isLoading: true,
  
  setSession: (session) => {
    if (!session?.user) {
      set({ userId: '', workspaces: [], currentWorkspaceId: null });
      return;
    }
    
    // Verificamos si la sesión es del tipo extendido
    const isExtendedSession = (s: Session): s is ExtendedSession => 
      s.user !== undefined && 'id' in s.user && 'workspaces' in s.user;
      
    if (isExtendedSession(session)) {
      // Si es extendida, usamos los datos directamente
      set({ 
        userId: session.user.id, 
        workspaces: session.user.workspaces,
        currentWorkspaceId: session.user.workspaces.length > 0 ? session.user.workspaces[0].id : null,
        isLoading: false
      });
    } else {
      // Si no es extendida, mantenemos el estado actual
      set({ isLoading: false });
      console.warn('Session does not contain extended user data');
    }
  },
  
  setCurrentWorkspace: (workspaceId) => {
    set({ currentWorkspaceId: workspaceId });
  },
  
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  
  getCurrentWorkspace: () => {
    const { workspaces, currentWorkspaceId } = get();
    return workspaces.find(w => w.id === currentWorkspaceId);
  },
  
  hasAccessToWorkspace: (workspaceId) => {
    const { workspaces } = get();
    return workspaces.some(w => w.id === workspaceId);
  }
})); 