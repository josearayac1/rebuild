import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (file) => {
  try {
    // Convertir el archivo a base64
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};