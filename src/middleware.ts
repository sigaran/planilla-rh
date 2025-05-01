import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/auth",
];

// Comprobar si una ruta es pública
const isPublicRoute = (path: string) => {
  return publicRoutes.some((route) => path.startsWith(route));
};

// Middleware para verificar la sesión de usuario
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Si es una ruta pública, permitir acceso sin comprobación
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Obtener el token de sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Si no hay token (usuario no autenticado) y no es una ruta pública,
  // redirigir a la página de inicio de sesión
  if (!token && !isPublicRoute(path)) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }

  // Verificar permisos para rutas administrativas
  if (path.includes("/admin") && token?.role?.name !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

// Configurar las rutas a las que se aplica el middleware
export const config = {
  // Aplicar el middleware a todas las rutas excepto a los archivos estáticos
  matcher: [
    // Rutas que requieren autenticación
    "/((?!api|_next/static|_next/image|icon.jpg|public/icons/google.svg).*)",
  ],
};
