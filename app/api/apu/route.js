import { prisma } from '../../lib/prisma'
import { NextResponse } from 'next/server'
import { getUserFromRequest } from '../../utils/auth'

// Listar APU (GET)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const apus = await prisma.apu.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        total: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(apus);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los APU' }, { status: 500 });
  }
}

// Crear APU (POST)
export async function POST(request) {
  try {
    const user = await getUserFromRequest();
    if (!user || user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const body = await request.json();
    const { name, categories } = body;
    if (!name || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }
    // Validar categorías y detalles
    for (const cat of categories) {
      if (!cat.name || !cat.details || !Array.isArray(cat.details) || cat.details.length === 0) {
        return NextResponse.json({ error: 'Cada categoría debe tener nombre y al menos un detalle' }, { status: 400 });
      }
      for (const det of cat.details) {
        if (!det.description || !det.yield || !det.unitPrice || !det.unitApuId) {
          return NextResponse.json({ error: 'Todos los campos de los detalles son requeridos' }, { status: 400 });
        }
      }
    }
    // Calcular total del APU
    let total = 0;
    categories.forEach(cat => {
      cat.details.forEach(det => {
        total += Number(det.subtotal) || 0;
      });
    });
    // Crear APU, categorías y detalles en transacción
    const apu = await prisma.apu.create({
      data: {
        name,
        total,
        userId: user.id,
        apuCategorys: {
          create: categories.map(cat => ({
            name: cat.name,
            apuDetails: {
              create: cat.details.map(det => ({
                description: det.description,
                yield: Number(det.yield),
                unitPrice: Number(det.unitPrice),
                subtotal: Number(det.subtotal),
                unitApuId: det.unitApuId,
              }))
            }
          }))
        }
      },
      include: {
        apuCategorys: {
          include: { apuDetails: true }
        }
      }
    });
    return NextResponse.json({ message: 'APU creado correctamente', apu });
  } catch (error) {
    console.error('Error al crear APU:', error);
    return NextResponse.json({ error: 'Error al crear el APU' }, { status: 500 });
  }
}

// Editar APU (PUT)
export async function PUT(request) {
  // Placeholder, se implementará después
  return NextResponse.json({ message: 'Editar APU (no implementado aún)' });
}
