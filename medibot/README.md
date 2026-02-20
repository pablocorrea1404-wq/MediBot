# 🏥 MediBot - Sistema de Gestión de Citas Médicas

**Proyecto Final de Curso - Desarrollo Web**  
Sistema completo de gestión de citas para clínicas dentales con automatización mediante IA.

---

## 📋 Índice
1. [¿Qué es MediBot?](#qué-es-medibot)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Cómo Funciona](#cómo-funciona)
6. [Instalación y Uso](#instalación-y-uso)
7. [Endpoints de la API](#endpoints-de-la-api)
8. [Automatizaciones con n8n](#automatizaciones-con-n8n)

---

## 🎯 ¿Qué es MediBot?

MediBot es un **sistema completo de gestión de citas médicas** diseñado para clínicas dentales que combina:

### Para el Personal de la Clínica:
- ✅ **Panel de gestión web** (React) para administrar pacientes, personal y citas
- ✅ **Calendario visual** para ver todas las citas del día
- ✅ **API REST completa** para integración con otros sistemas
- ✅ **Sincronización automática** con Google Calendar

### Para los Pacientes:
- ✅ **Bot de Telegram con IA** para atención 24/7
- ✅ **Agendar citas** conversando con el bot
- ✅ **Consultar disponibilidad** en tiempo real
- ✅ **Recibir confirmaciones** automáticas
- ✅ **Respuestas inteligentes** sobre servicios y precios

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una **arquitectura de microservicios** con Docker:

```
┌─────────────────────────────────────────────────────────┐
│              PERSONAL DE LA CLÍNICA (Web)                │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│   FRONTEND   │◄──────►│   BACKEND    │◄──────┐
│  React+Vite  │  API   │  Symfony 7   │       │
│  Port: 5173  │  REST  │  Port: 8000  │       │
└──────────────┘        └───────┬──────┘       │
                                │              │
                    ┌───────────┼──────┐       │
                    │           │      │       │
                    ▼           ▼      ▼       │
            ┌──────────┐ ┌──────────┐ ┌───────┴──────┐
            │ MariaDB  │ │   n8n    │ │  Telegram    │
            │ (Base de │ │(Automat.)│◄┤  Bot + IA    │
            │  Datos)  │ │Port: 5678│ │  (OpenAI)    │
            └──────────┘ └──────────┘ └───────▲──────┘
                                              │
                                              │
                                    ┌─────────┴─────────┐
                                    │   PACIENTES       │
                                    │   (Telegram App)  │
                                    └───────────────────┘
```

### Componentes:

1. **Frontend (React)**: Panel web para el personal de la clínica
2. **Backend (Symfony + API Platform)**: API REST que gestiona toda la lógica
3. **Base de Datos (MariaDB)**: Almacena pacientes, personal y citas
4. **n8n**: Automatiza tareas y gestiona el bot de Telegram
5. **Bot de Telegram + IA**: Atiende a pacientes 24/7 con inteligencia artificial
6. **phpMyAdmin**: Interfaz visual para gestionar la base de datos

---

## 💻 Tecnologías Utilizadas

### Frontend
- **React 18** - Librería de interfaces de usuario
- **Vite** - Build tool moderno y rápido
- **CSS Vanilla** - Estilos personalizados sin frameworks

### Backend
- **PHP 8.2** - Lenguaje de programación
- **Symfony 7** - Framework PHP profesional
- **API Platform 3** - Creación automática de APIs REST
- **Doctrine ORM** - Mapeo objeto-relacional para base de datos

### Base de Datos
- **MariaDB 10.6** - Sistema de gestión de bases de datos
- **phpMyAdmin** - Administración visual de la base de datos

### Automatización
- **n8n** - Plataforma de automatización de flujos de trabajo
- **Google Calendar API** - Sincronización de citas
- **OpenAI API** - Análisis inteligente de citas (opcional)

### DevOps
- **Docker** - Contenedorización de servicios
- **Docker Compose** - Orquestación de contenedores

---

## 📁 Estructura del Proyecto

```
medibot/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── AppointmentCalendar.jsx    # Calendario de citas
│   │   │   ├── NewAppointmentModal.jsx    # Modal para crear citas
│   │   │   ├── NewPatientModal.jsx        # Modal para crear pacientes
│   │   │   └── StaffManagement.jsx        # Gestión de personal
│   │   ├── App.jsx             # Componente principal
│   │   ├── index.css           # Estilos globales
│   │   └── main.jsx            # Punto de entrada
│   ├── index.html
│   ├── package.json
│   └── Dockerfile
│
├── backend/                     # API Symfony
│   ├── src/
│   │   ├── Entity/             # Modelos de datos
│   │   │   ├── Patient.php           # Entidad Paciente
│   │   │   ├── Staff.php             # Entidad Personal
│   │   │   └── Appointment.php       # Entidad Cita
│   │   ├── Controller/         # Controladores personalizados
│   │   │   └── AvailabilityController.php  # Horarios disponibles
│   │   └── Repository/         # Repositorios de datos
│   │       └── AppointmentRepository.php
│   ├── config/                 # Configuración
│   │   ├── packages/           # Configuración de bundles
│   │   ├── routes.yaml         # Rutas de la aplicación
│   │   ├── services.yaml       # Servicios de Symfony
│   │   └── bundles.php         # Bundles instalados
│   ├── public/
│   │   ├── index.php           # Punto de entrada
│   │   └── .htaccess           # Configuración Apache
│   ├── .env                    # Variables de entorno
│   ├── composer.json           # Dependencias PHP
│   └── Dockerfile
│
├── n8n_ai_receptionist.json    # Workflow de automatización
├── docker-compose.yml          # Orquestación de servicios
└── README.md                   # Este archivo
```

---

## ⚙️ Cómo Funciona

### 1. **El Usuario Accede al Frontend**
- Abre el navegador en `http://localhost:5173`
- Ve el calendario de citas del día actual

### 2. **Crear un Nuevo Paciente**
- Hace clic en "Nuevo Paciente"
- Rellena: Nombre, Email, Teléfono, DNI
- El frontend envía una petición `POST /api/patients` al backend
- El backend guarda el paciente en la base de datos MariaDB

### 3. **Agendar una Cita**
- Hace clic en "Nueva Cita"
- Selecciona un paciente existente o crea uno nuevo
- Elige fecha, hora y personal médico
- El frontend envía `POST /api/appointments`
- El backend guarda la cita

### 4. **Automatización con n8n** (Opcional)
- n8n detecta la nueva cita en la base de datos
- Crea un evento en Google Calendar
- Envía un email de confirmación al paciente
- Analiza la cita con IA para generar notas

### 5. **Consultar Datos**
- El administrador puede ver/editar la base de datos en `http://localhost:8080`
- Puede ver todas las citas, pacientes y personal

---

## 🚀 Instalación y Uso

### Requisitos Previos
- Docker Desktop instalado
- Puertos libres: 5173, 8000, 8080, 5678, 3306

### Paso 1: Clonar el Proyecto
```bash
cd "C:\Users\pablo\Documents\Proyecto final de curso\medibot"
```

### Paso 2: Levantar los Servicios
```powershell
docker-compose up -d
```

Esto levanta automáticamente:
- Frontend en `http://localhost:5173`
- Backend API en `http://localhost:8000/api`
- phpMyAdmin en `http://localhost:8080`
- n8n en `http://localhost:5678`

### Paso 3: Verificar que Todo Funciona
1. **Frontend**: Abre `http://localhost:5173` - Deberías ver el calendario
2. **Backend**: Abre `http://localhost:8000/api` - Deberías ver la documentación de la API
3. **Base de Datos**: Abre `http://localhost:8080` - Usuario: `user`, Contraseña: `password`
4. **n8n**: Abre `http://localhost:5678` - Configura tus automatizaciones

### Paso 4: Parar los Servicios
```powershell
docker-compose down
```

---

## � Endpoints de la API

La API REST está disponible en `http://localhost:8000/api`

### Pacientes (Patient)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/patients` | Listar todos los pacientes |
| POST | `/api/patients` | Crear un nuevo paciente |
| GET | `/api/patients/{id}` | Obtener un paciente específico |
| PUT | `/api/patients/{id}` | Actualizar un paciente |
| DELETE | `/api/patients/{id}` | Eliminar un paciente |

**Ejemplo de creación de paciente:**
```json
POST /api/patients
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "612345678",
  "dni": "12345678A"
}
```

### Personal (Staff)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/staff` | Listar todo el personal |
| POST | `/api/staff` | Crear un nuevo trabajador |
| GET | `/api/staff/{id}` | Obtener un trabajador específico |

**Ejemplo de creación de personal:**
```json
POST /api/staff
{
  "name": "Dra. María López",
  "specialty": "Ortodoncia",
  "email": "maria@clinica.com"
}
```

### Citas (Appointment)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/appointments` | Listar todas las citas |
| POST | `/api/appointments` | Crear una nueva cita |
| GET | `/api/appointments/{id}` | Obtener una cita específica |

**Ejemplo de creación de cita:**
```json
POST /api/appointments
{
  "patient": "/api/patients/1",
  "staff": "/api/staff/1",
  "appointmentDate": "2026-02-05T10:00:00",
  "status": "pending"
}
```

### Disponibilidad
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/availability?date=2026-02-05` | Obtener horarios disponibles |

---

## 🤖 Bot de Telegram con AI Agent

MediBot incluye un **asistente virtual inteligente** en Telegram que usa un **AI Agent con herramientas**.

### ¿Qué es un AI Agent?

A diferencia de un chatbot simple, un **AI Agent** puede:
- **Razonar** sobre qué hacer
- **Usar herramientas** para ejecutar acciones
- **Tomar decisiones** basadas en el contexto
- **Llamar a APIs** automáticamente

### Archivo: `n8n_telegram_bot.json`

Este workflow implementa un AI Agent con las siguientes **herramientas (tools)**:

### 🛠️ Herramientas del AI Agent

#### 1. **consultar_disponibilidad**
- **Qué hace**: Consulta horarios libres en la agenda
- **Cuándo se usa**: Cuando el paciente pregunta "¿Qué horarios tenéis?"
- **Cómo funciona**: Llama a `GET /api/availability?date=YYYY-MM-DD`
- **Devuelve**: Lista de horarios disponibles

#### 2. **crear_paciente**
- **Qué hace**: Crea un nuevo paciente en la base de datos
- **Cuándo se usa**: Cuando el AI Agent tiene nombre, email y teléfono
- **Cómo funciona**: Llama a `POST /api/patients`
- **Devuelve**: ID del paciente creado

#### 3. **crear_cita**
- **Qué hace**: Agenda una cita médica
- **Cuándo se usa**: Cuando el AI Agent tiene paciente_id y fecha/hora
- **Cómo funciona**: Llama a `POST /api/appointments`
- **Devuelve**: Confirmación de la cita

### 🤖 Flujo de Conversación Inteligente

**Ejemplo real de conversación:**

```
👤 Paciente: "Hola, quiero pedir cita para una limpieza"

🤖 MediBot: "¡Hola! Encantado de ayudarte. Déjame consultar 
             la disponibilidad..."
             [AI Agent usa herramienta: consultar_disponibilidad]
             
             "Tenemos disponibilidad:
             - Lunes 10:00
             - Martes 15:00
             - Miércoles 11:00
             
             ¿Cuál prefieres?"

👤 Paciente: "El lunes a las 10 está bien"

🤖 MediBot: "Perfecto. Para confirmar la cita necesito:
             - Tu nombre completo
             - Email
             - Teléfono"

👤 Paciente: "Juan Pérez, juan@gmail.com, 612345678"

🤖 MediBot: [AI Agent usa herramienta: crear_paciente]
             [AI Agent usa herramienta: crear_cita]
             
             "✅ ¡Cita confirmada!
             
             📅 Lunes 5 de febrero a las 10:00
             👤 Juan Pérez
             🦷 Limpieza dental
             
             Te enviaremos un recordatorio. ¡Nos vemos!"
```

### 🧠 Cómo Funciona el AI Agent

1. **Recibe mensaje** del paciente en Telegram
2. **Analiza la intención** con GPT-4
3. **Decide qué herramienta usar** (si es necesario)
4. **Ejecuta la herramienta** (llama a la API)
5. **Procesa el resultado**
6. **Genera respuesta natural** al paciente
7. **Envía mensaje** por Telegram

### Ventajas del AI Agent vs Chatbot Simple

| Característica | Chatbot Simple | AI Agent con Tools |
|----------------|----------------|-------------------|
| Responde preguntas | ✅ | ✅ |
| Ejecuta acciones | ❌ | ✅ |
| Consulta base de datos | ❌ | ✅ |
| Crea citas automáticamente | ❌ | ✅ |
| Razonamiento contextual | Limitado | Avanzado |
| Maneja flujos complejos | ❌ | ✅ |

### Cómo Configurar el Bot de Telegram:

#### Paso 1: Crear el Bot en Telegram
1. Abre Telegram y busca `@BotFather`
2. Envía `/newbot`
3. Elige un nombre: `MediBot Assistant`
4. Elige un username: `medibot_assistant_bot`
5. Copia el **token** que te da

#### Paso 2: Importar el Workflow en n8n
1. Abre `http://localhost:5678`
2. Ve a "Workflows" → "Import from File"
3. Selecciona `n8n_telegram_bot.json`

#### Paso 3: Configurar Credenciales
1. **Telegram Bot API**:
   - Pega el token de BotFather
   
2. **OpenAI API**:
   - Consigue tu API key en https://platform.openai.com
   - Pega la key en n8n
   - **Importante**: Usa GPT-4 para mejor razonamiento

#### Paso 4: Activar el Workflow
1. Haz clic en el botón "Active" en la esquina superior
2. ¡Listo! El AI Agent ya está funcionando

#### Paso 5: Probar el Bot
1. Abre Telegram
2. Busca tu bot: `@medibot_assistant_bot`
3. Envía `/start`
4. Prueba: "Quiero pedir cita para mañana a las 10"

---

## 🔄 Workflow Adicional: Sincronización con Google Calendar

### Archivo: `n8n_ai_receptionist.json`

Este workflow complementario:

### 1. **Monitoriza Nuevas Citas**
- Cada 5 minutos, consulta la base de datos
- Detecta citas sin sincronizar con Google Calendar

### 2. **Crea Eventos en Google Calendar**
- Crea automáticamente el evento
- Incluye: Título, fecha, hora, descripción
- Guarda el ID del evento en la base de datos

### 3. **Envía Confirmación por Email**
- Email al paciente confirmando la cita
- Incluye: Fecha, hora, doctor asignado

### 4. **Análisis con IA (Opcional)**
- Usa OpenAI para generar notas sobre la cita
- Clasifica el tipo de consulta
- Extrae palabras clave

### Cómo Configurar:
1. Importa `n8n_ai_receptionist.json` en n8n
2. Configura credenciales de Google Calendar
3. Configura SMTP para envío de emails
4. Activa el workflow

---

## 🎓 Conceptos Clave para la Defensa

### 1. **¿Por qué Docker?**
- **Portabilidad**: Funciona igual en cualquier máquina
- **Aislamiento**: Cada servicio en su propio contenedor
- **Facilidad**: Un solo comando levanta todo el sistema

### 2. **¿Por qué API Platform?**
- **Productividad**: Genera automáticamente endpoints REST
- **Estándares**: Sigue las mejores prácticas de APIs
- **Documentación**: Interfaz Swagger UI incluida

### 3. **¿Por qué React?**
- **Componentes reutilizables**: Código modular y mantenible
- **Virtual DOM**: Renderizado eficiente
- **Ecosistema**: Gran comunidad y librerías

### 4. **¿Por qué Symfony?**
- **Framework profesional**: Usado en empresas grandes
- **Seguridad**: Protección contra vulnerabilidades comunes
- **Escalabilidad**: Preparado para crecer

---

## 📊 Base de Datos

### Tablas Principales:

**patient** (Pacientes)
- `id` - Identificador único
- `name` - Nombre completo
- `email` - Correo electrónico
- `phone` - Teléfono
- `dni` - DNI/NIE

**staff** (Personal)
- `id` - Identificador único
- `name` - Nombre completo
- `specialty` - Especialidad (Ortodoncia, General, etc.)
- `email` - Correo electrónico

**appointment** (Citas)
- `id` - Identificador único
- `patient_id` - Referencia al paciente
- `staff_id` - Referencia al personal
- `appointment_date` - Fecha y hora de la cita
- `status` - Estado (pending, confirmed, cancelled)
- `google_calendar_id` - ID del evento en Google Calendar
- `notes_ia` - Notas generadas por IA

---

## 🔐 Credenciales

### Base de Datos (phpMyAdmin)
- **URL**: http://localhost:8080
- **Usuario**: `user`
- **Contraseña**: `password`
- **Base de datos**: `medibot`

### n8n
- **URL**: http://localhost:5678
- **Primera vez**: Crea tu propia cuenta

---

## 🎯 Puntos Fuertes del Proyecto

1. ✅ **Arquitectura Moderna**: Microservicios con Docker
2. ✅ **API REST Completa**: Documentada y funcional
3. ✅ **Frontend Responsive**: Diseño moderno y usable
4. ✅ **Automatización Real**: Integración con Google Calendar e IA
5. ✅ **Código Limpio**: Bien estructurado y comentado
6. ✅ **Escalable**: Fácil añadir nuevas funcionalidades
7. ✅ **Profesional**: Tecnologías usadas en la industria

---

## 📝 Comandos Útiles

### Ver logs de un servicio
```powershell
docker-compose logs backend
docker-compose logs frontend
docker-compose logs n8n
```

### Reiniciar un servicio
```powershell
docker-compose restart backend
```

### Limpiar caché del backend
```powershell
docker-compose exec backend rm -rf var/cache/*
```

### Acceder al contenedor
```powershell
docker-compose exec backend bash
```

---

## 🚨 Solución de Problemas

### El frontend no carga
```powershell
docker-compose restart frontend
docker-compose logs frontend
```

### La API da error 500
```powershell
docker-compose exec backend rm -rf var/cache/*
docker-compose restart backend
```

### No se conecta a la base de datos
```powershell
docker-compose restart db
docker-compose logs db
```

---

## 👨‍💻 Autor

**Pablo** - Proyecto Final de Curso  
Desarrollo Web - 2026

---

## 📄 Licencia

Este proyecto es de uso educativo.
