const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { OpenAI } = require('openai');
const tools = require('./tools');
require('dotenv').config();

// Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './sessions'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// WhatsApp Events
client.on('qr', (qr) => {
    console.log('QR RECIBIDO. POR FAVOR ESCANEA EL SIGUIENTE CÓDIGO QR:');
    qrcode.generate(qr, { small: true });
});

client.on('loading_screen', (percent, message) => {
    console.log('CARGANDO WHATSAPP:', message, percent + '%');
});

client.on('authenticated', () => {
    console.log('AUTENTICADO CORRECTAMENTE.');
});

client.on('auth_failure', msg => {
    console.error('ERROR DE AUTENTICACIÓN:', msg);
});

client.on('ready', () => {
    console.log('¡MediBot WhatsApp está listo y conectado!');
});

client.on('message', async (msg) => {
    // Ignorar si es un mensaje de grupo
    if (msg.from.includes('@g.us')) return;

    // Log para ver que el bot recibe algo de otros
    console.log(`--- Mensaje Recibido ---`);
    console.log(`De: ${msg.from}`);
    console.log(`Contenido: ${msg.body}`);

    try {
        console.log('Iniciando respuesta de MediBot IA...');
        await handleConversation(msg);
        console.log('Respuesta enviada.');
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

async function handleConversation(msg) {
    const systemMessage = `Eres MediBot, asistente virtual de la clínica dental. Tu objetivo es ayudar a los pacientes a agendar citas con el doctor adecuado.

PROFESIONALES Y ESPECIALIDADES:
1. Dra. Sarah Smith (ID: 1): Experta en Ortodoncia. Atiende brackets despegados, seguimiento de ortodoncia, Invisalign.
2. Dr. Mike Doe (ID: 2): Odontólogo General. Atiende caries, dolor de muelas, extracciones, empastes.
3. Lisa Ray (ID: 3): Higienista dental. Atiende limpiezas dentales, sarro, blanqueamientos.

FLUJO DE TRABAJO:
1. Identifica el problema del paciente. 
2. Selecciona al profesional adecuado según las especialidades arriba indicadas.
3. Usa 'consultar_disponibilidad' pasando la fecha (YYYY-MM-DD) y el staff_id del doctor seleccionado.
4. Si el paciente no está registrado, pide Nombre, Email y Teléfono y usa 'crear_paciente'.
5. Usa 'crear_cita' pasando paciente_id, fecha_hora (ISO 8601), servicio (descripción breve) y el staff_id del doctor.
6. Confirma todos los detalles al final.

Sé amable, empático y profesional.`;

    const availableTools = [
        {
            type: "function",
            function: {
                name: "consultar_disponibilidad",
                description: "Consulta horarios disponibles para una fecha y doctor específico.",
                parameters: {
                    type: "object",
                    properties: {
                        fecha: { type: "string", description: "Fecha en formato YYYY-MM-DD" },
                        staff_id: { type: "number", description: "ID del profesional" }
                    },
                    required: ["fecha", "staff_id"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "crear_paciente",
                description: "Crea un nuevo registro de paciente.",
                parameters: {
                    type: "object",
                    properties: {
                        nombre: { type: "string" },
                        email: { type: "string" },
                        telefono: { type: "string" }
                    },
                    required: ["nombre", "email", "telefono"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "crear_cita",
                description: "Agenda una cita dental.",
                parameters: {
                    type: "object",
                    properties: {
                        paciente_id: { type: "number" },
                        fecha_hora: { type: "string", description: "Formato ISO 8601" },
                        servicio: { type: "string" },
                        staff_id: { type: "number" }
                    },
                    required: ["paciente_id", "fecha_hora", "staff_id"]
                }
            }
        }
    ];

    let messages = [
        { role: "system", content: systemMessage },
        { role: "user", content: msg.body }
    ];

    let runLoop = true;
    while (runLoop) {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: messages,
            tools: availableTools,
            tool_choice: "auto",
        });

        const responseMessage = response.choices[0].message;

        if (responseMessage.tool_calls) {
            messages.push(responseMessage);

            for (const toolCall of responseMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);

                console.log(`Ejecutando herramienta: ${functionName}`);
                const functionResponse = await tools[functionName](functionArgs);

                messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: functionResponse,
                });
            }
        } else {
            runLoop = false;
            console.log('Enviando respuesta a WhatsApp...');
            // Respondemos al chat de donde vino el mensaje
            await client.sendMessage(msg.from, responseMessage.content);
        }
    }
}

console.log('Inicializando servidor WhatsApp...');
client.initialize().catch(err => console.error('Error al inicializar:', err));
