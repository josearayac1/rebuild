const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Crear Región Metropolitana
  const metropolitana = await prisma.region.create({
    data: {
      name: 'Región Metropolitana de Santiago',
      ordinal: 'XIII',
      cities: {
        create: [
          {
            name: 'Santiago',
            communes: {
              create: [
                { name: 'Santiago' },
                { name: 'Providencia' },
                { name: 'Las Condes' },
                { name: 'Ñuñoa' },
                { name: 'La Reina' },
                { name: 'Vitacura' },
                { name: 'Lo Barnechea' },
                { name: 'Independencia' },
                { name: 'Recoleta' },
                { name: 'Macul' },
                { name: 'Peñalolén' },
                { name: 'La Florida' },
                { name: 'San Joaquín' },
                { name: 'La Granja' },
                { name: 'San Miguel' },
                { name: 'Pedro Aguirre Cerda' },
                { name: 'San Ramón' },
                { name: 'La Cisterna' },
                { name: 'El Bosque' },
                { name: 'Lo Espejo' },
                { name: 'Estación Central' },
                { name: 'Cerrillos' },
                { name: 'Maipú' },
                { name: 'Quinta Normal' },
                { name: 'Lo Prado' },
                { name: 'Pudahuel' },
                { name: 'Cerro Navia' },
                { name: 'Renca' },
                { name: 'Quilicura' },
                { name: 'Conchalí' },
                { name: 'Huechuraba' }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Base de datos poblada con éxito')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 