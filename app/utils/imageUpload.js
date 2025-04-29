import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary usando streams.
 * @param {File|Blob} file - Archivo de imagen recibido (por ejemplo, desde un formulario).
 * @param {string} [folder='properties'] - Carpeta de Cloudinary donde se guardará la imagen ('properties' o 'profiles').
 * @returns {Promise<string>} URL segura de la imagen subida.
 */
export async function uploadImage(file, folder = 'properties') {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
}