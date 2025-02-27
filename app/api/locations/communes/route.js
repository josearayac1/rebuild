import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const cityId = searchParams.get('cityId')

    if (!cityId) {
      return NextResponse.json(
        { error: 'cityId es requerido' },
        { status: 400 }
      )
    }

    const communes = await prisma.commune.findMany({
      where: { cityId }
    })
    
    return NextResponse.json(communes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener comunas' },
      { status: 500 }
    )
  }
} 