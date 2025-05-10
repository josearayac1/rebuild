// Crear propiedad
// Listar propiedades
// Actualizar propiedad
// Eliminar propiedad 

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { verifyToken } from '../../utils/jwt';
import { uploadImage } from '../../utils/imageUpload';

const prisma = new PrismaClient();

// ... configuración existente de cloudinary ...

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  try {
    if (id) {
      // Obtener una propiedad por ID (detalle)
      const property = await prisma.property.findUnique({
        where: { id: Number(id) },
        include: {
          photos: true,
          status: true,
          propertyType: true,
          commune: true,
          region: true,
          city: true,
          inspections: {
            orderBy: { createdAt: 'desc' },
            take: 1 // Solo la inspección más reciente
          }
        }
      });
      if (!property) {
        return new Response(JSON.stringify(null), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify(property), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
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

    // Si no hay 'type', devolver propiedades del propietario autenticado
    const token = cookies().get('auth-token');
    if (!token) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }
    const payload = verifyToken(token.value);
    if (!payload || payload.userType !== 'OWNER') {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    // Buscar el OwnerProfile asociado al usuario autenticado
    const ownerProfile = await prisma.ownerProfile.findUnique({
      where: { userId: payload.id }
    });
    if (!ownerProfile) {
      return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Buscar propiedades del propietario
    const properties = await prisma.property.findMany({
      where: { ownerId: ownerProfile.id },
      include: {
        photos: true,
        status: true,
        propertyType: true,
        commune: true,
        region: true,
        city: true
      },
      orderBy: { id: 'desc' }
    });

    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    // 1. Obtener el token de la cookie
    const token = cookies().get('auth-token');
    if (!token) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    // 2. Verificar el token
    const payload = verifyToken(token.value);
    if (!payload || payload.userType !== 'OWNER') {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    // 3. Procesar el formData
    const formData = await request.formData();
    
    // Validar datos básicos
    const requiredFields = [
      'statusId', 'propertyTypeId', 'bedrooms', 'bathrooms', 'innerArea', 'terraceArea', 'address',
      'estateCompany', 'estateProject', 'unitNumber', 'regionId', 'cityId', 'communeId'
    ];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return new Response(JSON.stringify({ error: `Falta el campo requerido: ${field}` }), { status: 400 });
      }
    }

    // Validación extra para IDs de región, ciudad y comuna
    const regionId = formData.get('regionId');
    const cityId = formData.get('cityId');
    const communeId = formData.get('communeId');
    if (!regionId || !cityId || !communeId || regionId === 'undefined' || cityId === 'undefined' || communeId === 'undefined') {
      return new Response(JSON.stringify({ error: 'Debes seleccionar región, ciudad y comuna válidas.' }), { status: 400 });
    }
    
    // Extraer datos básicos de la propiedad
    const propertyData = {
      statusId: formData.get('statusId'),
      propertyTypeId: formData.get('propertyTypeId'),
      bedrooms: parseInt(formData.get('bedrooms')),
      bathrooms: parseInt(formData.get('bathrooms')),
      innerArea: parseFloat(formData.get('innerArea')),
      terraceArea: parseFloat(formData.get('terraceArea')),
      address: formData.get('address'),
      estateCompany: formData.get('estateCompany'),
      estateProject: formData.get('estateProject'),
      unitNumber: formData.get('unitNumber'),
      regionId: formData.get('regionId'),
      cityId: formData.get('cityId'),
      communeId: formData.get('communeId'),
      // ... otros campos necesarios
    };

    // Obtener las imágenes del formData
    const images = formData.getAll('images');

    // Subir imágenes a Cloudinary usando la función utilitaria
    const imageUrls = await Promise.all(
      images.map(image => uploadImage(image, 'properties'))
    );

    // Buscar el OwnerProfile asociado al usuario autenticado
    const ownerProfile = await prisma.ownerProfile.findUnique({
      where: { userId: payload.id }
    });
    if (!ownerProfile) {
      return new Response(JSON.stringify({ error: 'Debes completar tu perfil de propietario antes de crear una propiedad.' }), { status: 400 });
    }

    // Crear la propiedad y sus fotos en la base de datos
    const property = await prisma.property.create({
      data: {
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        innerArea: propertyData.innerArea,
        terraceArea: propertyData.terraceArea,
        address: propertyData.address,
        estateCompany: propertyData.estateCompany,
        estateProject: propertyData.estateProject,
        unitNumber: propertyData.unitNumber,
        status: { connect: { id: propertyData.statusId } },
        propertyType: { connect: { id: propertyData.propertyTypeId } },
        owner: { connect: { id: ownerProfile.id } },
        commune: { connect: { id: propertyData.communeId } },
        region: { connect: { id: propertyData.regionId } },
        city: { connect: { id: propertyData.cityId } },
        photos: {
          create: imageUrls.map(url => ({
            url: url
          }))
        }
      },
      include: {
        photos: true
      }
    });

    return new Response(JSON.stringify(property), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 