// Solicitar inspección
// Listar inspecciones
// Actualizar estado
// Generar informe 

import { prisma } from '../../lib/prisma'
import { NextResponse } from 'next/server'
import { getUserFromRequest } from '../../utils/auth'

// Solicitar inspección
export async function POST(request) {
  try {
    const { propertyId, visitDate, instructions } = await request.json();

    // Validar datos
    if (!propertyId || !visitDate) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Obtener usuario autenticado (de cualquier tipo)
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Validar que sea propietario
    if (user.userType !== 'OWNER') {
      return NextResponse.json({ error: 'Solo los propietarios pueden solicitar inspección' }, { status: 403 });
    }

    // Buscar el perfil de propietario
    const ownerProfile = await prisma.ownerProfile.findUnique({ where: { userId: user.id } });
    if (!ownerProfile) {
      return NextResponse.json({ error: 'Perfil de propietario no encontrado' }, { status: 403 });
    }

    // Verificar que la propiedad pertenezca al usuario
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true }
    });

    if (!property || property.owner.userId !== user.id) {
      return NextResponse.json({ error: 'No tienes permiso para solicitar inspección de esta propiedad' }, { status: 403 });
    }

    // Crear inspección
    const inspection = await prisma.inspection.create({
      data: {
        status: 'SOLICITADO',
        visitDate: new Date(visitDate),
        instructions: instructions || '',
        property: { connect: { id: propertyId } },
        commune: { connect: { id: property.communeId } },
        city: { connect: { id: property.cityId } },
        region: { connect: { id: property.regionId } },
      }
    });

    return NextResponse.json({ message: 'Inspección solicitada', inspection });

  } catch (error) {
    console.error('Error al solicitar inspección:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ error: 'Falta el propertyId' }, { status: 400 });
    }

    // Traer la propiedad y sus inspecciones
    const property = await prisma.property.findUnique({
      where: { id: Number(propertyId) },
      include: {
        propertyType: true,
        inspections: {
          orderBy: { visitDate: 'desc' },
          include: {
            inspectionReport: true
          }
        }
      }
    });

    if (!property) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    // Adjunta los datos de la propiedad a cada inspección para facilitar el frontend
    const inspections = property.inspections.map(insp => ({
      ...insp,
      property: {
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        estateProject: property.estateProject,
        address: property.address
      }
    }));

    return NextResponse.json({ inspections, property });

  } catch (error) {
    console.error('Error al obtener inspecciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 