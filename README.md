# legalsuite API

Solucion a prueba tecnica legalsuite: API REST para la gestión de abogados y demandas en un bufete legal. Desarrollada con Node.js, TypeScript, Express, PostgreSQL y Sequelize.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Configuración Inicial](#configuración-inicial)
- [Instalación](#instalación)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Base de Datos](#base-de-datos)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Documentación de la API](#documentación-de-la-api)
- [Scripts Disponibles](#scripts-disponibles)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Solución de Problemas](#solución-de-problemas)
- [Estructura del Proyecto](#estructura-del-proyecto)

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

### Software Requerido

**Versiones Verificadas y Compatibles:**

- **Node.js**: v22.19.0
- **npm**: 10.9.3
- **Docker**: 27.5.1
- **Docker Compose**: v2.32.4
- **Git**: para clonar el repositorio

> **Nota**: Estas son las versiones exactas con las que el proyecto ha sido probado y funciona correctamente. Se recomienda usar estas versiones específicas para garantizar la compatibilidad completa.

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Docker
docker --version

# Verificar Docker Compose
docker compose version
```

## ⚙️ Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/KristianSchajris/web_service_legalsuite.git
cd web_service_legalsuite
```

### 2. Instalar Dependencias

```bash
npm install
```

## 🔐 Configuración de Variables de Entorno

### 1. Crear Archivo de Variables de Entorno

```bash
cp .env.example .env
```

### 2. Variables de Entorno Preconfiguradas

**✅ Las variables de entorno ya están configuradas** en el archivo `.env.development` con valores por defecto para desarrollo. Al copiar este archivo a `.env`, tendrás la siguiente configuración:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=legalsuite
DB_DIALECT=postgres

# Configuración JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
```

### 3. Configuración Adicional (Opcional)

**⚠️ Para Producción**: 
- Cambia `JWT_SECRET` por una clave secreta segura y única
- Actualiza las credenciales de la base de datos según tu entorno
- Modifica `NODE_ENV=production` para el entorno de producción

**💡 Para Desarrollo**: Las variables preconfiguradas funcionan directamente con Docker Compose sin modificaciones adicionales.

## 🗄️ Base de Datos

### 1. Iniciar PostgreSQL con Docker

```bash
# Iniciar contenedor de PostgreSQL
docker compose up -d postgres

# Verificar que el contenedor esté ejecutándose
docker compose ps
```

### 2. Ejecutar Migraciones

```bash
# Ejecutar todas las migraciones para crear las tablas
npx sequelize-cli db:migrate
```

### 3. Poblar Base de Datos con Seeders

```bash
# Ejecutar todos los seeders para datos de prueba
npx sequelize-cli db:seed:all
```

**📋 Migraciones Disponibles:**
- `20250922001419-create-user.js` - Crear tabla de usuarios
- `20250922001427-create-lawyer.js` - Crear tabla de abogados  
- `20250922001436-create-lawsuit.js` - Crear tabla de demandas

**🌱 Seeders Disponibles:**
- `20250922002336-Users.js` - Datos de prueba para usuarios
- `20250922002343-Lawyers.js` - Datos de prueba para abogados
- `20250922002352-Lawsuits.js` - Datos de prueba para demandas

## 🚀 Ejecución del Proyecto

### Modo Desarrollo

```bash
# Iniciar en modo desarrollo con hot-reload
npm run dev
```

### Modo Producción

```bash
# Compilar TypeScript
npm run build

# Iniciar aplicación compilada
npm start
```

### Usando Docker Compose (Recomendado)

```bash
# Iniciar toda la aplicación (base de datos + API)
docker compose up -d

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down
```

## 📚 Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a:

- **Swagger UI**: http://localhost:3000/api-docs
- **API Base URL**: http://localhost:3000/api

### Endpoints Principales

- `POST /api/auth/login` - Autenticación
- `GET /api/lawyers` - Listar abogados
- `POST /api/lawyers` - Crear abogado
- `GET /api/lawsuits` - Listar demandas
- `POST /api/lawsuits` - Crear demanda
- `PUT /api/lawsuits/:id/assign` - Asignar abogado a demanda

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar en modo desarrollo
npm run build            # Compilar TypeScript
npm start                # Iniciar aplicación compilada

# Testing
npm test                 # Ejecutar todos los tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura
npm run test:unit        # Solo tests unitarios
npm run test:integration # Solo tests de integración
npm run test:e2e         # Solo tests end-to-end
npm run test:ci          # Tests para CI/CD

# Base de Datos
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Ejecutar seeders
```

## 💡 Ejemplos de Uso

### 1. Autenticación

```bash
# Obtener token de acceso
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Crear un Abogado

```bash
# Crear nuevo abogado (requiere token de admin)
curl -X POST http://localhost:3000/api/lawyers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "+1234567890",
    "specialization": "Derecho Civil"
  }'
```

### 3. Crear una Demanda

```bash
# Crear nueva demanda (requiere token de admin)
curl -X POST http://localhost:3000/api/lawsuits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "case_number": "CASE-2024-001",
    "plaintiff": "María García",
    "defendant": "Empresa XYZ",
    "case_type": "civil"
  }'
```

### 4. Listar Demandas con Filtros

```bash
# Listar demandas por estado
curl -X GET "http://localhost:3000/api/lawsuits?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Listar demandas por abogado
curl -X GET "http://localhost:3000/api/lawsuits?lawyer_id=LAWYER_UUID" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Solución de Problemas

### Error: "Puerto 3000 ya está en uso"

```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Terminar proceso
kill -9 <PID>

# O cambiar puerto en .env
PORT=3001
```

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL esté ejecutándose
docker compose ps

# Reiniciar contenedor de base de datos
docker compose restart postgres

# Verificar logs de PostgreSQL
docker compose logs postgres
```

### Error: "JWT_SECRET is not defined"

```bash
# Verificar que el archivo .env existe
ls -la .env

# Verificar contenido del archivo .env
cat .env

# Asegurar que JWT_SECRET esté definido
echo "JWT_SECRET=tu_clave_secreta_aqui" >> .env
```

### Error: "Sequelize migration failed"

```bash
# Verificar conexión a base de datos
npm run db:migrate

# Si falla, reiniciar base de datos
docker compose down
docker compose up -d postgres
npm run db:migrate
```

### Error: "Module not found"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "TypeScript compilation failed"

```bash
# Verificar configuración de TypeScript
npx tsc --noEmit

# Limpiar directorio de compilación
rm -rf dist
npm run build
```

### Problemas de Permisos en Docker

```bash
# En sistemas Unix/Linux, agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker
```

### Logs de Depuración

```bash
# Ver logs de la aplicación
npm run dev

# Ver logs de Docker
docker compose logs -f

# Ver logs específicos de PostgreSQL
docker compose logs postgres
```

## 📁 Estructura del Proyecto

```
web_service_legalsuite/
├── src/
│   ├── application/          # Casos de uso y lógica de aplicación
│   │   ├── interfaces/       # Interfaces de aplicación
│   │   ├── mappers/          # Mappers de datos
│   │   └── use-cases/        # Casos de uso
│   ├── domain/               # Entidades y lógica de dominio
│   │   ├── entities/         # Entidades del dominio
│   │   ├── interfaces/       # Interfaces del dominio
│   │   └── repositories/     # Interfaces de repositorios
│   ├── infrastructure/       # Implementaciones de infraestructura
│   │   ├── adapters/         # Adaptadores externos
│   │   ├── auth/             # Configuración de autenticación
│   │   ├── config/           # Configuraciones
│   │   ├── database/         # Modelos y migraciones
│   │   ├── di/               # Inyección de dependencias
│   │   ├── middlewares/      # Middlewares de Express
│   │   ├── repositories/     # Implementaciones de repositorios
│   │   └── utils/            # Utilidades
│   ├── interfaces/           # Capa de presentación
│   │   ├── controllers/      # Controladores HTTP
│   │   ├── mappers/          # Mappers de presentación
│   │   └── routes/           # Definición de rutas
│   └── index.ts              # Punto de entrada
├── tests/                    # Tests
│   ├── e2e/                  # Tests end-to-end
│   ├── integration/          # Tests de integración
│   └── unit/                 # Tests unitarios
├── .env.example              # Variables de entorno de ejemplo
├── docker-compose.yml        # Configuración de Docker
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Este archivo
```

## 🔒 Credenciales por Defecto

Después de ejecutar los seeders, puedes usar estas credenciales:

- **Usuario Admin**: `admin` / `admin123`
- **Usuario Lawyer**: `lawyer1` / `lawyer123`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.