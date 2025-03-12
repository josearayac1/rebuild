// Crear propiedad
// Listar propiedades
// Actualizar propiedad
// Eliminar propiedad 

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// ... configuración existente de cloudinary ...

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

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extraer datos básicos de la propiedad
    const propertyData = {
      statusId: formData.get('statusId'),
      propertyTypeId: formData.get('propertyTypeId'),
      bedrooms: parseInt(formData.get('bedrooms')),
      bathrooms: parseInt(formData.get('bathrooms')),
      surface: parseFloat(formData.get('surface')),
      terrace: parseFloat(formData.get('terrace')),
      address: formData.get('address'),
      // ... otros campos necesarios
    };

    // Obtener las imágenes del formData
    const images = formData.getAll('images');

    // Subir imágenes a Cloudinary
    const uploadPromises = images.map(async (image) => {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'properties',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      return uploadResponse.secure_url;
    });

    // Esperar a que todas las imágenes se suban
    const imageUrls = await Promise.all(uploadPromises);

    // Crear la propiedad y sus fotos en la base de datos
    const property = await prisma.property.create({
      data: {
        ...propertyData,
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