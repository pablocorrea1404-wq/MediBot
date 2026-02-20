# 📱 MediBot - WhatsApp Integration

Este módulo permite que **MediBot** atienda a los pacientes directamente a través de WhatsApp, utilizando la librería `whatsapp-web.js` y la API de OpenAI.

## 🚀 Requisitos
1. Node.js instalado.
2. El backend de MediBot debe estar corriendo (Docker).
3. Una API Key de OpenAI.

## ⚙️ Configuración
1. Entra en la carpeta `whatsapp-bot`:
   ```bash
   cd whatsapp-bot
   ```
2. Edita el archivo `.env` y añade tu `OPENAI_API_KEY`.
3. Asegúrate de que `BACKEND_URL` apunte a tu backend (por defecto `http://localhost:8000/api`).

## 🏃‍♂️ Cómo Ejecutar
Para iniciar el bot:
```bash
npm start
```

### Primera Ejecución
La primera vez aparecerá un **código QR** en la terminal. Escanéalo con tu WhatsApp (Dispositivos vinculados) para iniciar sesión. La sesión se guardará en la carpeta `/sessions` para que no tengas que escanearlo cada vez.

## 🛠️ Herramientas Integradas (AI Agent)
El bot utiliza un Agente de IA (GPT-4) con las siguientes capacidades:
- **Consultar Disponibilidad**: Mira los huecos libres en la agenda de la clínica.
- **Crear Paciente**: Registra nuevos pacientes si no existen.
- **Crear Cita**: Agenda citas vinculándolas al paciente y al doctor correspondiente.

## 📂 Estructura de Archivos
- `index.js`: Lógica principal del bot y conexión con WhatsApp.
- `tools.js`: Definición de las funciones que llaman a la API del backend.
- `.env`: Variables de entorno.
- `sessions/`: Almacén de la sesión de WhatsApp (generado automáticamente).

## 💡 Próximos Pasos (Prácticas)
Como mencionaste que trabajarás con **Odoo**, puedes extender este bot añadiendo nuevas herramientas en `tools.js` que se conecten a la API de Odoo mediante XML-RPC para:
- Consultar facturas.
- Sincronizar clientes con el CRM de Odoo.
- Gestionar inventario de la clínica.
