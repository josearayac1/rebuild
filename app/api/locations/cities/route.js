import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const regionId = searchParams.get('regionId')

    if (!regionId) {
      return NextResponse.json(
        { error: 'regionId es requerido' },
        { status: 400 }
      )
    }

    const cities = await prisma.city.findMany({
      where: { regionId }
    })
    
    return NextResponse.json(cities)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener ciudades' },
      { status: 500 }
    )
  }
} 