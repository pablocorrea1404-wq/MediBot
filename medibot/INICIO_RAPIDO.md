# ⚡ INICIO RÁPIDO - MediBot

## 🚀 Levantar Todo el Sistema

```powershell
docker-compose up -d
```

Espera 30 segundos a que todos los servicios arranquen.

---

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interfaz de usuario |
| **Backend API** | http://localhost:8000/api | Documentación de la API |
| **Base de Datos** | http://localhost:8080 | phpMyAdmin (user/password) |
| **Automatización** | http://localhost:5678 | n8n workflows |

---

## ✅ Verificar que Todo Funciona

### 1. Frontend
- Abre: http://localhost:5173
- Deberías ver el calendario de citas

### 2. Backend
- Abre: http://localhost:8000/api
- Deberías ver la documentación de API Platform

### 3. Base de Datos
- Abre: http://localhost:8080
- Usuario: `user`
- Contraseña: `password`
- Deberías ver las tablas: patient, staff, appointment

### 4. n8n
- Abre: http://localhost:5678
- Primera vez: Crea una cuenta
- Importa el workflow: `n8n_ai_receptionist.json`

---

## 🧪 Prueba Rápida

### Crear un Paciente
1. Ve a http://localhost:5173
2. Clic en "Nuevo Paciente"
3. Rellena:
   - Nombre: Juan Pérez
   - Email: juan@example.com
   - Teléfono: 612345678
   - DNI: 12345678A
4. Clic en "Crear Paciente"

### Agendar una Cita
1. Clic en "Nueva Cita"
2. Selecciona el paciente que acabas de crear
3. Elige fecha y hora
4. Clic en "Crear Cita"

### Verificar en la Base de Datos
1. Ve a http://localhost:8080
2. Login: user / password
3. Selecciona base de datos "medibot"
4. Abre la tabla "appointment"
5. Deberías ver tu cita

---

## 🛑 Parar el Sistema

```powershell
docker-compose down
```

---

## 🔄 Reiniciar un Servicio

```powershell
# Reiniciar frontend
docker-compose restart frontend

# Reiniciar backend
docker-compose restart backend

# Reiniciar base de datos
docker-compose restart db
```

---

## 📋 Ver Logs

```powershell
# Ver logs del backend
docker-compose logs backend

# Ver logs en tiempo real
docker-compose logs -f backend
```

---

## 🧹 Limpiar Caché del Backend

```powershell
docker-compose exec backend rm -rf var/cache/*
docker-compose restart backend
```

---

## 📚 Documentación Completa

- **README.md** - Documentación técnica completa
- **GUIA_DEFENSA.md** - Guía para defender el proyecto

---

## 🆘 Problemas Comunes

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

### No puedo acceder a phpMyAdmin
```powershell
docker-compose restart pma
```

### Los contenedores no arrancan
```powershell
docker-compose down
docker-compose up -d
```

---

¡Listo! 🎉
