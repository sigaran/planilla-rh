// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import { DefaultSession, User as NextAuthUser, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";
import { Role } from '@prisma/client';

export type UserRole = {
  id: string;
  name: string;
  permissions: string[];
};

export interface WorkspaceWithRole {
  id: string;
  name: string;
  role?: string;
  permissions: string[];
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: Role | null;
      workspaces?: WorkspaceWithRole[];
      currentWorkspaceId?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    user?: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends NextAuthUser {
    id: string;
    role: Role | null;
    workspaces?: WorkspaceWithRole[];
    currentWorkspaceId?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends NextAuthJWT {
    id: string;
    role: UserRole | null;
    error?: string;
  }
} 