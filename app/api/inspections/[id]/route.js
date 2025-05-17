import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'
import { getUserFromRequest } from '../../../utils/auth'

// Obtener inspección por ID
export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Obtener usuario autenticado
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Buscar la inspección con todos sus datos relacionados
        const inspection = await prisma.inspection.findUnique({
            where: { id },
            include: {
                property: {
                    include: {
                        propertyType: true,
                        photos: true,
                        owner: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                commune: true,
                city: true,
                region: true,
                inspector: {
                    include: {
                        user: true
                    }
                },
                inspectionReport: true
            }
        });

        if (!inspection) {
            return NextResponse.json({ error: 'Inspección no encontrada' }, { status: 404 });
        }

        // Verificar permisos
        if (user.userType === 'PROFESSIONAL') {
            // Si es profesional, solo puede ver sus propias inspecciones asignadas
            if (inspection.inspectorId && inspection.inspectorId !== user.id) {
                return NextResponse.json({ error: 'No tienes permiso para ver esta inspección' }, { status: 403 });
            }
        } else if (user.userType === 'OWNER') {
            // Si es propietario, solo puede ver inspecciones de sus propiedades
            if (inspection.property.owner.userId !== user.id) {
                return NextResponse.json({ error: 'No tienes permiso para ver esta inspección' }, { status: 403 });
            }
        }

        return NextResponse.json({ inspection });

    } catch (error) {
        console.error('Error al obtener inspección:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// Actualizar inspección por ID
export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        // Obtener usuario autenticado
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Verificar que la inspección exista
        const existingInspection = await prisma.inspection.findUnique({
            where: { id },
            include: {
                property: {
                    include: {
                        owner: true
                    }
                }
            }
        });

        if (!existingInspection) {
            return NextResponse.json({ error: 'Inspección no encontrada' }, { status: 404 });
        }

        // Verificar permisos según el tipo de usuario
        if (user.userType === 'PROFESSIONAL') {
            // Profesionales solo pueden actualizar inspecciones asignadas a ellos
            if (existingInspection.inspectorId !== user.id) {
                return NextResponse.json({ error: 'No tienes permiso para actualizar esta inspección' }, { status: 403 });
            }
        } else if (user.userType === 'OWNER') {
            // Propietarios solo pueden actualizar inspecciones de sus propiedades
            if (existingInspection.property.owner.userId !== user.id) {
                return NextResponse.json({ error: 'No tienes permiso para actualizar esta inspección' }, { status: 403 });
            }
        }

        // Actualizar la inspección
        const updatedInspection = await prisma.inspection.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            },
            include: {
                property: {
                    include: {
                        propertyType: true,
                        photos: true
                    }
                },
                commune: true,
                city: true,
                region: true
            }
        });

        return NextResponse.json({
            message: 'Inspección actualizada correctamente',
            inspection: updatedInspection
        });

    } catch (error) {
        console.error('Error al actualizar inspección:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
} 