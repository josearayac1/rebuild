# Rebuild - Plataforma de Gestión de Inspecciones

## Descripción
Rebuild es una plataforma web diseñada para facilitar la gestión de inspecciones de propiedades. La aplicación permite a propietarios y profesionales del sector inmobiliario coordinar y realizar inspecciones de manera eficiente.

### Características Principales
- Sistema de autenticación para propietarios y profesionales
- Gestión de propiedades y sus detalles
- Programación y seguimiento de inspecciones
- Panel de administración para gestión de usuarios y contenido
- Sistema de APU (Análisis de Precios Unitarios) para inspecciones
- Interfaz responsiva y amigable

## Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn
- PostgreSQL
- Prisma CLI

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/josearayac1/rebuild.git
cd rebuild
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/rebuild"
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

4. Configurar la base de datos:
```bash
npx prisma migrate dev
npx prisma db seed
```

## Ejecución Local

1. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

2. Abrir el navegador en `http://localhost:3000`

## Estructura del Proyecto
```
rebuild/
├── app/                    # Directorio principal de la aplicación
│   ├── api/               # Endpoints de la API
│   ├── components/        # Componentes reutilizables
│   └── ...               # Otras carpetas de la aplicación
├── prisma/                # Configuración de la base de datos
├── public/               # Archivos estáticos
└── ...                   # Archivos de configuración
```

## Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run test`: Ejecuta las pruebas

## Tecnologías Utilizadas
- Next.js 14
- React
- Prisma
- PostgreSQL
- Tailwind CSS
- NextAuth.js

## Contribución
1. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
2. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abrir un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 