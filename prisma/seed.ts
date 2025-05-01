import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Generar hash de contraseña
  const password = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Crear roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'Administrador del sistema',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'USER',
      description: 'Usuario regular',
    },
  });

  // Crear usuario administrador
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: passwordHash, // Contraseña: admin123
      roleId: adminRole.id,
    },
  });

  // Crear usuario regular
  const regularUser = await prisma.user.create({
    data: {
      name: 'User',
      email: 'user@example.com',
      passwordHash: passwordHash, // Contraseña: admin123
      roleId: userRole.id,
    },
  });

  console.log({ adminRole, userRole, adminUser, regularUser });
  console.log('Usuarios creados con la contraseña: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 