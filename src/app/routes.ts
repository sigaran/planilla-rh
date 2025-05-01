export const routes = {
  home: '/',
  dashboard: '/dashboard',
  login: '/auth/signin',
  register: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  employees: '/employees',
  payroll: '/payroll',
  deductions: '/deductions',
  benefits: '/benefits',
  settings: '/settings',
  profile: '/profile',
  help: '/help',
  logout: '/logout'
} as const;

export type Route = typeof routes[keyof typeof routes];

// Definimos las claves para navegación, para ser usadas con el hook useTranslations
export const navigationKeys = {
  dashboard: 'dashboard',
  employees: 'employees',
  payroll: 'payroll',
  deductions: 'deductions',
  benefits: 'benefits',
  settings: 'settings',
  help: 'help',
  profile: 'profile',
  logout: 'logout'
} as const;

// Este array contiene la información de los items de navegación excepto el nombre que debe ser traducido
export const navigationItems = [
  { key: navigationKeys.dashboard, href: routes.dashboard, icon: 'HomeIcon' },
  { key: navigationKeys.employees, href: routes.employees, icon: 'PersonIcon' },
  { key: navigationKeys.payroll, href: routes.payroll, icon: 'FileIcon' },
  { key: navigationKeys.deductions, href: routes.deductions, icon: 'MinusIcon' },
  { key: navigationKeys.benefits, href: routes.benefits, icon: 'PlusIcon' },
  { key: navigationKeys.settings, href: routes.settings, icon: 'GearIcon' },
  { key: navigationKeys.help, href: routes.help, icon: 'QuestionMarkIcon' }
] as const; 