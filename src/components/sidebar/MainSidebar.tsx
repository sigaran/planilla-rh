'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TypographyLarge } from '@/components/typography';
import { ChevronDown, Home, User, Clock, FileText, Settings, HelpCircle, LogOut, Sun, Moon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { useAuth } from '@/hooks/useAuth';
import { navigationKeys, routes } from '@/app/routes';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// Importación temporal hasta que tengamos los servicios reales
// Estas líneas deberán ser actualizadas con las rutas correctas cuando existan los archivos
const SessionService = {
    setSigningOut: (status: boolean) => {
        console.log('Setting signing out status:', status);
    }
};

const useSessionStore = {
    getState: () => ({
        setSession: (session: Session | null) => {
            console.log('Setting session:', session);
        }
    })
};

interface MenuItem {
    id: string;
    key: string;
    icon: React.ReactNode;
    href: string;
}

export function MainSidebar() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    
    // Usar el hook personalizado que creamos
    const { 
        workspaces, 
        currentWorkspaceId, 
        currentWorkspace,
        switchWorkspace
    } = useAuth();
    
    // Define menu items
    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            key: navigationKeys.dashboard,
            icon: <Home className="w-5 h-5" />,
            href: routes.dashboard,
        },
        {
            id: 'employees',
            key: navigationKeys.employees,
            icon: <User className="w-5 h-5" />,
            href: routes.employees,
        },
        {
            id: 'attendance',
            key: 'Asistencias',
            icon: <Clock className="w-5 h-5" />,
            href: routes.attendance,
        },
        {
            id: 'payroll',
            key: navigationKeys.payroll,
            icon: <FileText className="w-5 h-5" />,
            href: routes.payroll,
        },
        {
            id: 'settings',
            key: navigationKeys.settings,
            icon: <Settings className="w-5 h-5" />,
            href: routes.settings,
        },
        {
            id: 'help',
            key: navigationKeys.help,
            icon: <HelpCircle className="w-5 h-5" />,
            href: routes.help,
        }
    ];

    // Componente para mostrar la primera letra del workspace
    const WorkspaceIcon = ({ name }: { name: string }) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary font-semibold">
            {name.charAt(0)}
        </div>
    );

    const handleSignOut = async () => {
        try {
            // Indicar que estamos en proceso de cierre de sesión
            SessionService.setSigningOut(true);
            
            // Limpiar la sesión en el store
            const setSession = useSessionStore.getState().setSession;
            setSession(null);
            
            // Redirigir al login
            router.push('/auth/signin');
            
            // Cerrar sesión en NextAuth
            setTimeout(() => {
                signOut({
                    redirect: false
                });
            }, 100);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Restaurar el estado en caso de error
            SessionService.setSigningOut(false);
        }
    };

    return (
        <div className="h-full w-64 border-r border-border flex flex-col bg-background">
            {/* Logo */}
            <div className="p-3">
                <div className='flex justify-start pl-3 items-center gap-x-2'>
                    <div className="relative w-10 h-8">
                        <Image src="/icon.jpg" alt="Planilla" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <TypographyLarge className="text-xl text-muted-foreground">
                        planillas
                    </TypographyLarge>
                </div>
            </div>

            {/* Workspace selector */}
            {workspaces && workspaces.length > 0 && (
                <div className="p-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between" size="sm">
                                <div className="flex items-center gap-3 w-full">
                                    <div className='bg-primary/20 text-primary rounded-md m-1'>
                                        <WorkspaceIcon name={currentWorkspace?.name || 'Seleccionar Empresa'} />
                                    </div>
                                    <span className="flex-1 truncate">{currentWorkspace?.name || 'Seleccionar Empresa'}</span>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[250px]">
                            {workspaces.map((workspace) => (
                                <DropdownMenuItem
                                    key={workspace.id}
                                    onClick={() => switchWorkspace(workspace.id)}
                                    className={cn(
                                        'cursor-pointer',
                                        currentWorkspaceId === workspace.id && 'bg-muted'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className='bg-primary/20 text-primary rounded-md m-1'>
                                            <WorkspaceIcon name={workspace.name} />
                                        </div>
                                        <span className="truncate">{workspace.name}</span>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {/* Navigation menu */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link href={item.href} key={item.id}>
                            <Button
                                variant={pathname === item.href ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                    "w-full my-1 justify-start cursor-pointer transition-all duration-200",
                                    pathname === item.href ? 'bg-primary text-primary-foreground shadow-sm' : ''
                                )}
                            >
                                <div className="flex gap-4 ml-2 w-full items-center">
                                    <div className={pathname === item.href ? 'text-primary-foreground' : 'text-muted-foreground'}>
                                        {item.icon}
                                    </div>
                                    <span className={cn(
                                        'font-medium',
                                        pathname === item.href ? 'text-primary-foreground' : 'text-foreground'
                                    )}>
                                        {item.key}
                                    </span>
                                </div>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            {/* User profile section */}
            <div className="p-3 mt-auto">
                <div className="h-px bg-border mb-3" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full">
                            <div className="flex items-center gap-3 justify-start w-full">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || ''} />
                                    <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate text-foreground">{session?.user?.name || 'Usuario'}</p>
                                    <p className="text-xs truncate text-muted-foreground">{session?.user?.email || 'email@example.com'}</p>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>{session?.user?.name || 'Usuario'}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="w-full">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span>Tema</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => setTheme('light')}>
                                            <Sun className="mr-2 h-4 w-4" />
                                            <span>Claro</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme('dark')}>
                                            <Moon className="mr-2 h-4 w-4" />
                                            <span>Oscuro</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme('system')}>
                                            <span className="ml-6">Sistema</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}