import { Session } from "next-auth";
import { WorkspaceWithRole } from "@/types/next-auth";

// Interfaz para la sesión extendida que esperamos recibir
export interface ExtendedSession extends Session {
  user: {
    id: string;
    workspaces: WorkspaceWithRole[];
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// Helper function to safely get user ID from session
export function getUserId(session: Session | null): string {
  if (!session?.user) return '';
  
  // Verificamos si la sesión es del tipo extendido
  if (isExtendedSession(session)) {
    return session.user.id;
  }
  
  return '';
}

// Type guard to check if a session has extended properties
export function isExtendedSession(session: Session): session is ExtendedSession {
  return session.user !== undefined && 'id' in session.user && 'workspaces' in session.user;
}

// Helper function to safely get user workspaces from session
export function getUserWorkspaces(session: Session | null): WorkspaceWithRole[] {
  if (!session?.user) return [];
  
  if (isExtendedSession(session)) {
    return session.user.workspaces;
  }
  
  return [];
}

// Helper to check if user has access to a specific workspace
export function hasWorkspaceAccess(session: Session | null, workspaceId: string): boolean {
  const workspaces = getUserWorkspaces(session);
  return workspaces.some(w => w.id === workspaceId);
} 