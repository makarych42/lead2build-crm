import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начало заполнения базы данных...')

  // Проверяем, существует ли уже администратор
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@lead2build.ru' },
  })

  if (existingAdmin) {
    console.log('✅ Администратор уже существует')
    return
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash('Admin123!', 10)

  // Создаем администратора
  const admin = await prisma.user.create({
    data: {
      name: 'Администратор',
      email: 'admin@lead2build.ru',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+7 (999) 123-45-67',
      active: true,
      blocked: false,
    },
  })

  console.log('✅ Создан администратор:', {
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })

  // Создаем дополнительных пользователей для тестирования
  const testUsers = [
    {
      name: 'Иван Петров',
      email: 'sales@lead2build.ru',
      role: 'SALES_MANAGER',
      phone: '+7 (999) 111-22-33',
    },
    {
      name: 'Мария Смирнова',
      email: 'documents@lead2build.ru',
      role: 'DOCUMENT_SPECIALIST',
      phone: '+7 (999) 222-33-44',
    },
    {
      name: 'Алексей Сидоров',
      email: 'inspector@lead2build.ru',
      role: 'TECHNICAL_INSPECTOR',
      phone: '+7 (999) 333-44-55',
    },
    {
      name: 'Елена Кузнецова',
      email: 'voting.coord@lead2build.ru',
      role: 'VOTING_COORDINATOR',
      phone: '+7 (999) 444-55-66',
    },
    {
      name: 'Дмитрий Волков',
      email: 'voting.manager@lead2build.ru',
      role: 'VOTING_MANAGER',
      phone: '+7 (999) 555-66-77',
    },
  ]

  const testPassword = await bcrypt.hash('Test123!', 10)

  for (const userData of testUsers) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: testPassword,
        active: true,
        blocked: false,
      },
    })

    console.log('✅ Создан пользователь:', {
      email: user.email,
      name: user.name,
      role: user.role,
    })
  }

  console.log('\n📝 Учетные данные для входа:')
  console.log('\nАдминистратор:')
  console.log('  Email: admin@lead2build.ru')
  console.log('  Пароль: Admin123!')
  console.log('\nТестовые пользователи:')
  console.log('  Email: sales@lead2build.ru (и другие)')
  console.log('  Пароль: Test123!')
  console.log('\n✨ База данных заполнена!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

