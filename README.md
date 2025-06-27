# 🧠 Plataforma LMS - Iskander

Una plataforma LMS (Learning Management System) desarrollada con:

- 🎨 **Frontend:** RemixJS (`iskander-app`)
- 🔧 **Backend:** Laravel con Sanctum (`iskander-backend`)

---

## 📁 Estructura del proyecto

├── iskander-app/ # Frontend - RemixJS
├── iskander-backend/ # Backend - Laravel
└── README.md


---

## 🚀 Requisitos

### 🔧 Requisitos generales

- **Node.js** v20.x o superior
- **npm** v10.x o superior
- **PHP** v8.2 o superior
- **Composer** v2.x
- **MySQL** 8.x
- **Extensiones de PHP necesarias**:
  - `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `bcmath`, `curl`, `fileinfo`, etc.

---

## ▶️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/dAlarc0n/ISKANDER.git
cd ISKANDER

2. Configurar y levantar el backend (Laravel)
cd iskander-backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate

php artisan serve

📍 El backend estará disponible en: http://127.0.0.1:8000

3. Configurar y levantar el frontend (RemixJS)
cd ../iskander-app
npm install
npm run dev

📍 El frontend estará disponible en: http://localhost:3000

⚙️ Variables de entorno

APP_NAME=Iskander
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=iskander_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

🟢 Frontend (iskander-app/.env)

API_ROUTE=http://localhost
PORT=8000
SESSION_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAA

🔐 Autenticación y gestión de usuarios
La autenticación está implementada con Laravel Sanctum.

Accesos:
La única ruta pública es el login.

Todas las demás rutas están protegidas por middleware.

El acceso se gestiona según el tipo de usuario:

Rol	Acceso
Admin	Acceso total, creación y modificación de contenido
Profesor	Visualiza todo y puede modificar sus propios cursos
Usuario	Solo puede acceder y visualizar contenido disponible

🧰 Herramientas utilizadas
Frontend (iskander-app)
RemixJS

Tailwind CSS

shadcn/ui

Axios

Sonner (para notificaciones toast)

Backend (iskander-backend)
Laravel 12

Sanctum para autenticación API

MySQL como base de datos

🌱 Flujo de trabajo
Convención de ramas
prod: rama principal de producción

Para nuevas funcionalidades:

feature/nombre-de-la-feature

📤 Deploy
Este proyecto está pensado para ser desplegado en un servidor VPS que tenga instalado:

PHP 8.2

MySQL

Node.js 20

Nginx o Apache

Se recomienda servir el backend (iskander-backend) con Laravel (artisan o Forge) y el frontend (iskander-app) como aplicación independiente (mediante pm2, nginx o reverse proxy a Vite server, según tu preferencia).
