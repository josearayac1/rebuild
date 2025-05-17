import { prisma } from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const units = await prisma.unitApu.findMany({
      select: { id: true, name: true }
    });
    return NextResponse.json(units);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener unidades' }, { status: 500 });
  }
}
