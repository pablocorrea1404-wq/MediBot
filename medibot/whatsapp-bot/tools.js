const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.BACKEND_URL;

async function consultar_disponibilidad(args) {
    const { fecha, staff_id } = args;
    const date = fecha || new Date().toISOString().split('T')[0];
    try {
        const response = await axios.get(`${API_URL}/availability`, {
            params: {
                date: date,
                staffId: staff_id
            }
        });
        return JSON.stringify(response.data);
    } catch (error) {
        console.error('Error in consultar_disponibilidad:', error.message);
        return JSON.stringify({ error: 'No se pudo consultar la disponibilidad' });
    }
}

async function crear_paciente(args) {
    const { nombre, email, telefono } = args;
    try {
        const response = await axios.post(`${API_URL}/patients`, {
            name: nombre,
            email: email,
            phone: telefono,
            dni: '' // Default or empty
        });
        return JSON.stringify({
            paciente_id: response.data.id,
            mensaje: `Paciente ${nombre} creado con ID ${response.data.id}`
        });
    } catch (error) {
        console.error('Error in crear_paciente:', error.message);
        return JSON.stringify({ error: 'No se pudo crear el paciente' });
    }
}

async function crear_cita(args) {
    const { paciente_id, fecha_hora, servicio, staff_id } = args;
    try {
        const response = await axios.post(`${API_URL}/appointments`, {
            patient: `/api/patients/${paciente_id}`,
            staff: `/api/staff/${staff_id}`,
            appointmentDate: fecha_hora,
            status: 'pending',
            notes: servicio || ''
        });
        return JSON.stringify({
            mensaje: `Cita creada con éxito para el ${fecha_hora} con el profesional solicitado.`
        });
    } catch (error) {
        console.error('Error in crear_cita:', error.message);
        return JSON.stringify({ error: 'No se pudo crear la cita' });
    }
}

module.exports = {
    consultar_disponibilidad,
    crear_paciente,
    crear_cita
};
