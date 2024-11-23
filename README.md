<h1 align="center">MS Usuario</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <img alt="nodejs" src="https://img.shields.io/badge/nodeJS-18.16.0-green.svg?cacheSeconds=2592000" />
</p>

# Descripción Proyecto

1. **`src/`**: Carpeta principal del código fuente.
2. **`config/`**: Contiene configuraciones generales como loggers, etc.
3. **`controllers/`**: Define la lógica de negocio y manipula los datos según sea necesario, recibe las peticiones desde las rutas y utiliza los **services/**.
4. **`middlewares/`**: Funciones middleware que se ejecutan antes de llegar a los controladores, como autenticación o manejo de errores.
5. **`entities/`**: Define la estructura de los datos y cómo interactúan con la base de datos (usualmente usando ORM/ODM).
6. **`routes/`**: Define los endpoints de la API y asocia cada endpoint a un controlador específico.
7. **`services/`**: Contiene la lógica de negocio más compleja y las operaciones de manipulación de datos. Se utilizan dentro de los controladores.
8. **`utils/`**: Funciones de utilidad que pueden ser usadas en varias partes del proyecto, como formateadores.
9. **`interfaces/`**: Validadores de datos de entrada (usualmente utilizando librerías como Joi, Yup, etc.).
10. **`index.ts`**: Configuración principal de la aplicación, como middlewares globales, parsing de JSON, etc.
11. **`tests/`**: Carpeta dedicada para pruebas unitarias e integrales.

Esta estructura es muy flexible y puede expandirse o adaptarse según las necesidades del proyecto.

```
root/
├── api/
├── src/                       # Carpeta principal del código fuente
│   ├── config/                # Archivos de configuración (conexión a DB, variables de entorno, etc.)
│   │   ├── db.config.ts       # Configuración de la base de datos
│   │   └── ...                # Otros archivos de configuración
│   │
│   ├── controllers/           # Controladores para manejar la lógica de negocio
│   │   ├── user.controller.ts # Controlador de usuarios
│   │   └── ...                # Otros controladores
│   │
│   ├── middlewares/           # Middlewares personalizados
│   │   ├── auth.middleware.ts # Middleware de autenticación
│   │   └── ...                # Otros middlewares
│   │
│   ├── entities/              # entidades de datos (bases de datos, ORM/ODM)
│   │   ├── user.entity.ts     # Modelo de usuario
│   │   └── ...                # Otros modelos
│   │
│   ├── routes/                # Definición de rutas
│   │   ├── user.routes.ts     # Rutas de usuarios
│   │   └── ...                # Otros archivos de rutas
│   │
│   ├── services/              # Servicios que contienen la lógica de negocio
│   │   ├── user.service.ts    # Servicio de usuarios
│   │   └── ...                # Otros servicios
│   │
│   ├── utils/                 # Utilidades y helpers
│   │   ├── util.ts            # Funciones para manejo de lógicas
│   │   └── ...                # Otros helpers y utilidades
│   │
│   ├── interfaces/            # Tipos e interfaces
│   │   ├── user.interfaces.ts # Validador de usuarios
│   │   └── ...                # Otros validadores
│   │
│   ├── tests/                 # Tipos e interfaces
│   │   ├── controllers/       # Pruebas para controladores
│   │   ├── services/          # Pruebas para servicios
│   │   └── ...                # Otras pruebas
│   │
│   ├── app.ts                 # Configuración de la aplicación Express
│   └── server.ts              # Punto de entrada para iniciar el servidor
│
├── .env.example               # Archivo de variables de entorno
├── .gitignore                 # Archivos y carpetas ignoradas por Git
├── package.json               # Dependencias y scripts de NPM
├── package-lock.json          # Bloqueo de versiones de dependencias
├── README.md                  # Documentación del proyecto
├── nodemon.json
├── tsconfig.json
├── dockerfile
├── jest.config.ts             # Archivo de configuración de Jest

```

# Install dependencies

```sh
npm install
```

# Run development mode

start server app

```sh
npm run dev
```

# Run Test

start server app

```sh
npm run test
```

# Run productive mode

#### Bundles the app

```sh
npm run build
```

#### Start server app

```sh
npm run start
```

# Docker

## Docker build

```
docker build -t template-express:v1 .
```

## docker run

```
docker run -p 8001:8001 template-express:v1
```

```
docker run --env-file .env template-express:v1
```

## Author

👤 **Alaya Digital Solutions**

- Website: https://www.alaya.cl/
- Github: [@alaya-digital-solutions](https://github.com/alaya-digital-solutions)
