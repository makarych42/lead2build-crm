import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for leads (fallback для сервера)
let leads: any[] = []

// На сервере используем простое хранилище в памяти
// localStorage доступен только на клиенте
function getLeadsFromStorage(): any[] {
  return leads
}

function saveLeadsToStorage(leadsData: any[]): void {
  leads = leadsData
}

export async function GET() {
  try {
    // Возвращаем пустой массив, так как данные теперь хранятся только в localStorage на клиенте
    return NextResponse.json({ leads: [] })
  } catch (error) {
    console.error('Ошибка при получении лидов:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      address,
      city,
      contactPerson,
      contactPhone,
      contactEmail,
      source
    } = body

    // Проверяем обязательные поля
    if (!address || !city || !contactPerson || !contactPhone || !source) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      )
    }

    // Create new lead
    const newLead = {
      id: Date.now().toString(), // Simple ID generation
      address,
      city,
      contactPerson,
      contactPhone,
      contactEmail: contactEmail || null,
      source,
      status: 'NEW',
      currentStage: 'INITIAL_CONSULTATION',
      createdAt: new Date().toISOString(),
      buildingType: null,
      floorsCount: null,
      apartmentsCount: null
    }

    // Не сохраняем на сервере, только возвращаем созданный лид
    // Сохранение обрабатывается на клиенте через localStorage

    return NextResponse.json({ lead: newLead }, { status: 201 })
  } catch (error) {
    console.error('Ошибка при создании лида:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() // Get ID from URL path
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID лида не указан' },
        { status: 400 }
      )
    }

    // Просто возвращаем успешный ответ
    // Удаление обрабатывается на клиенте через localStorage

    return NextResponse.json({ message: 'Лид успешно удален' })
  } catch (error) {
    console.error('Ошибка при удалении лида:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}