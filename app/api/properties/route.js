// Crear propiedad
// Listar propiedades
// Actualizar propiedad
// Eliminar propiedad 

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    if (type === 'status') {
      const statuses = await prisma.status.findMany();
      return new Response(JSON.stringify(statuses), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } 
    else if (type === 'propertyType') {
      const propertyTypes = await prisma.propertyType.findMany();
      return new Response(JSON.stringify(propertyTypes), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ error: 'Invalid type parameter' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 