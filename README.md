# Sistema de Planillas - Funeraria Promesas De Jesus

Sistema de gestión de planillas para Funeraria Promesas De Jesus, desarrollado con Next.js 14, TypeScript, y Shadcn UI.

## Características Principales

- 🔐 Autenticación con NextAuth.js
- 🌐 Internacionalización con next-intl
- 🎨 UI moderna con Shadcn UI y Tailwind CSS
- 📱 Diseño responsive
- 🔄 Estado del servidor con React Server Components
- 🎯 Validación de formularios con Zod y React Hook Form
- 🔍 Búsqueda y filtrado avanzado
- 📊 Gestión de planillas y empleados
- 📈 Reportes y estadísticas

## Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **UI**: Shadcn UI + Tailwind CSS
- **Autenticación**: NextAuth.js
- **Base de datos**: Prisma + SQLite
- **Validación**: Zod + React Hook Form
- **Internacionalización**: next-intl
- **Estado**: React Server Components
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide Icons

## Requisitos

- Node.js 18.17 o superior
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/WillianChavez/planillas.git
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

4. Configurar la base de datos:
```bash
npm run db:dev
npm run db:seed
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Usuarios Predeterminados

Al ejecutar el seed, se crean los siguientes usuarios:

| Correo | Contraseña | Rol |
|--------|------------|-----|
| admin@example.com | admin123 | ADMIN |
| user@example.com | admin123 | USER |

## Estructura del Proyecto

```
src/
├── app/                    # Rutas de la aplicación
├── components/            # Componentes reutilizables
├── contexts/             # Contextos de React
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y configuraciones
├── messages/             # Archivos de internacionalización
├── prisma/               # Esquema y migraciones de Prisma
└── types/                # Tipos de TypeScript
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run db:reset` - Reinicia la base de datos (elimina datos y migraciones)
- `npm run db:dev` - Ejecuta las migraciones en desarrollo
- `npm run db:seed` - Carga datos iniciales (usuarios y roles)
- `npm run db:studio` - Abre Prisma Studio para gestionar datos

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y está bajo licencia PRIVATE.

## Contacto

Willian Alexander Chávez Servellón - williamchavezamaya@gmail.com