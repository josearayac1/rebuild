import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const regions = await prisma.region.findMany()
    return NextResponse.json(regions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener regiones' },
      { status: 500 }
    )
  }
} 