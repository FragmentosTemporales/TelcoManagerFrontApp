# TelcoManagerFrontApp

Proyecto frontend para la gestión de procesos Telco.

## Contenido

- Ejemplo de `.env`
- Comandos de instalación con npm
- Estructura del proyecto por carpetas
- Cómo ejecutar: `npm run dev`

## Ejemplo de archivo .env

Este proyecto usa variables de entorno para configurar el cliente HTTP y autenticación. Crea un archivo `.env` en la raíz del proyecto (no subirlo al control de versiones).

Ejemplo mínimo:

VITE_API_BASE_URL=https://api.miempresa.local
VITE_AUTH_TOKEN=
VITE_SOME_FEATURE_FLAG=true

Notas:
- Las variables que comienzan con `VITE_` estarán disponibles en el código cliente (import.meta.env).
- Añade otras variables necesarias según tus integraciones (Sentry, analytics, etc.).

## Requisitos

- Node.js 16+ (recomendado LTS)
- npm 8+ o yarn/pnpm según preferencia

Comprueba tu versión de Node:

node -v

## Instalación (npm)

1. Instalar dependencias:

npm install

2. Crear el archivo `.env` siguiendo el ejemplo anterior.

## Estructura del proyecto (resumen por carpetas)

Raíz del proyecto:

- `index.html` - HTML base
- `vite.config.js` - Configuración Vite
- `package.json` - Dependencias y scripts
- `README.md` - Documentación (esta)

Carpeta `src/` (código fuente)

- `main.jsx`, `App.jsx` - Punto de entrada y componente raíz
- `api/` - Clientes y wrappers para peticiones HTTP (axios, endpoints por dominio)
  - `authAPI.jsx`, `axiosClient.jsx`, `ticketeraAPI.jsx`, ...
- `components/` - Componentes reutilizables (formularios, navbar, header, viewers)
- `data/` - Datos estáticos o helpers de fixtures
- `helpers/` - Utilidades compartidas (p. ej. gestión de sonidos)
- `slices/` - Slices de Redux (o similar) para estado centralizado
- `store/` - Configuración del store
- `theme/` - Paleta y temas de UI
- `utils/` - Rutas privadas, 404 y utilidades generales
- `views/` - Vistas y páginas (Home, Login, panels y formularios)

Public:

- `public/` - Archivos estáticos servidos tal cual (favicon, index.html alternativo)

## Scripts útiles (package.json)

- `npm run dev` — Ejecuta el servidor de desarrollo (Vite)
- `npm run build` — Genera artefactos de producción
- `npm run preview` — Previsualiza build de producción
- `npm run lint` — Ejecuta linters (si están configurados)

Comprueba el `package.json` para ver scripts adicionales.

## Ejecución (desarrollo)

1. Instala dependencias:

npm install

2. Ejecuta el servidor de desarrollo:

npm run dev

El servidor iniciará normalmente en `http://localhost:5173` (por defecto de Vite). Revisa la salida en la terminal para la URL exacta.

## Buenas prácticas

- No subas tu `.env` al repositorio. Añade `.env` a tu `.gitignore`.
- Usa variables `VITE_` para exponerlas al cliente deliberadamente.
- Mantén las llamadas API centralizadas en `src/api/`.

## Próximos pasos sugeridos

- Añadir una sección de rutas y diagrama de navegación
- Documentar convenciones de commits y branching
- Añadir instrucciones para tests unitarios e2e

## Contacto y licencia

>Cristian Rivera Acevedo
>Dominion Global / Telco
