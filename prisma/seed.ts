import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  await db.user.upsert({
    where: { email: 'admin@kazfilm.kz' },
    update: {},
    create: {
      email: 'admin@kazfilm.kz',
      name: 'Администратор',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const modPassword = await bcrypt.hash('mod123', 12)

  await db.user.upsert({
    where: { email: 'user@test.kz' },
    update: {},
    create: {
      email: 'user@test.kz',
      name: 'Тестовый пользователь',
      password: userPassword,
      role: 'USER',
    },
  })

  await db.user.upsert({
    where: { email: 'moderator@kazfilm.kz' },
    update: {},
    create: {
      email: 'moderator@kazfilm.kz',
      name: 'Модератор',
      password: modPassword,
      role: 'MODERATOR',
    },
  })

  console.log('Seed completed.')
  console.log('Admin:     admin@kazfilm.kz      / admin123')
  console.log('Moderator: moderator@kazfilm.kz  / mod123')
  console.log('User:      user@test.kz          / user123')
}

main().finally(() => db.$disconnect())
