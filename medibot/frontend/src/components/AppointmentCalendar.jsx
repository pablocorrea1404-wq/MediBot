import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar as CalIcon, MessageSquare, ChevronRight, X, User, Check, Trash2 } from 'lucide-react';
import PatientHistoryModal from './PatientHistoryModal';
import NewAppointmentModal from './NewAppointmentModal';

export default function AppointmentCalendar({ patients, sharedAppointments, onSaveAppointment, onAddPatient, isNewAptOpen, setIsNewAptOpen }) {
    const [selectedApt, setSelectedApt] = useState(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDoctor, setSelectedDoctor] = useState('all');
    const [editingApt, setEditingApt] = useState(null);

    // Formatear para visualización
    const formatDate = (date) => {
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return 'Fecha inválida';
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        } catch (e) { return '---'; }
    };

    const fechaSeleccionadaStr = formatDate(selectedDate);

    // Transformar los datos de la API (con seguridad contra fallos)
    const formatAppointments = (rawApts) => {
        if (!Array.isArray(rawApts)) return [];
        return rawApts.map(apt => {
            if (!apt) return null;
            const dateObj = new Date(apt.appointmentDate);
            return {
                id: apt.id,
                patient: apt.patient?.name || 'Paciente Sin Nombre',
                patientId: apt.patient?.id || apt.patient?.['@id']?.split('/').pop(),
                date: formatDate(dateObj),
                time: !isNaN(dateObj.getTime()) ? dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--',
                status: apt.status === 'confirmed' ? 'confirmada' : (apt.status === 'cancelled' ? 'cancelada' : (apt.status === 'presentado' ? 'presentado' : 'pendiente')),
                type: 'General',
                doctor: apt.staff?.name || 'Dr. Admin',
                notes: apt.notes || '',
                aiSummary: apt.notesIa || "Pendiente de análisis por IA",
                source: "Web",
                service: apt.service
            };
        }).filter(a => a !== null);
    };

    const appointmentsList = formatAppointments(sharedAppointments);
    const citasDeHoy = appointmentsList.filter(apt => {
        const matchesDate = apt.date === fechaSeleccionadaStr;
        const matchesDoctor = selectedDoctor === 'all' || apt.doctor === selectedDoctor;
        return matchesDate && matchesDoctor;
    });

    const handleAddAppointment = async (data) => {
        try {
            const [year, month, day] = data.date.split('-');
            const [hours, minutes] = data.time.split(':');
            const appointmentDate = new Date(year, month - 1, day, hours, minutes);

            const isEditing = !!editingApt;
            const url = isEditing
                ? `http://127.0.0.1:8000/api/appointments/${editingApt.id}`
                : 'http://127.0.0.1:8000/api/appointments';

            const method = isEditing ? 'PATCH' : 'POST';
            const headers = isEditing
                ? { 'Content-Type': 'application/merge-patch+json', 'Accept': 'application/json' }
                : { 'Content-Type': 'application/json', 'Accept': 'application/json' };

            const body = {
                patient: data.patientId.startsWith('/api/') ? data.patientId : `/api/patients/${data.patientId}`,
                appointmentDate: appointmentDate.toISOString(),
                status: isEditing ? (editingApt.status === 'confirmada' ? 'confirmed' : 'pending') : 'pending',
                notes: data.notes || '',
                service: data.serviceId ? (data.serviceId.startsWith('/api/') ? data.serviceId : `/api/medical_services/${data.serviceId}`) : null
            };

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const savedApt = await response.json();
                onSaveAppointment(savedApt);
                setIsNewAptOpen(false);
                setEditingApt(null);
            } else {
                const error = await response.json();
                alert("Error al guardar cita: " + (error.detail || "Verifica los datos"));
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión al servidor");
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/appointments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/merge-patch+json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                const updated = await response.json();
                onSaveAppointment(updated);
                setSelectedApt(formatAppointments([updated])[0]);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Calendar Main */}
            <div className="lg:w-2/3 space-y-8">
                <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">Calendario Clínico</span>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{formatDate(selectedDate)}</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setSelectedDate(new Date())} className="px-5 py-2.5 text-xs font-black text-slate-500 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all uppercase tracking-widest">Hoy</button>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><ChevronRight className="w-5 h-5 rotate-180 text-slate-600" /></button>
                                <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {citasDeHoy.length > 0 ? (
                            citasDeHoy.sort((a, b) => a.time.localeCompare(b.time)).map((apt) => (
                                <div
                                    key={apt.id}
                                    onClick={() => setSelectedApt(apt)}
                                    className={`group relative p-6 rounded-3xl border-2 transition-all cursor-pointer ${selectedApt?.id === apt.id ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-200' : 'bg-white border-transparent hover:border-blue-100 hover:bg-slate-50/50'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-6">
                                            <div className={`text-center min-w-[70px] p-3 rounded-2xl transition-all ${selectedApt?.id === apt.id ? 'bg-white/10' : 'bg-slate-100'}`}>
                                                <span className={`block text-lg font-black ${selectedApt?.id === apt.id ? 'text-white' : 'text-slate-800'}`}>{apt.time}</span>
                                            </div>
                                            <div>
                                                <h4 className={`font-black text-xl tracking-tight transition-all ${selectedApt?.id === apt.id ? 'text-white' : 'text-slate-900'}`}>{apt.patient}</h4>
                                                <div className={`flex items-center text-xs font-bold mt-1 transition-all ${selectedApt?.id === apt.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    <Clock className="w-3.5 h-3.5 mr-2" /> {apt.doctor}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${selectedApt?.id === apt.id ? 'bg-white/20 text-white' : (apt.status === 'presentado' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}`}>
                                            {apt.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                                <CalIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">Agenda Vacía</h4>
                                <button onClick={() => setIsNewAptOpen(true)} className="mt-4 px-8 py-3 bg-white border border-slate-200 text-blue-600 font-black rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all text-xs uppercase tracking-widest">Agendar Cita</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Sidebar */}
            <div className="lg:w-1/3">
                <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl text-white sticky top-28 border border-white/5">
                    <button
                        onClick={() => setIsNewAptOpen(true)}
                        className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black shadow-xl shadow-blue-900/40 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 mb-10 uppercase text-xs tracking-[0.2em]"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Nueva Cita</span>
                    </button>

                    {selectedApt ? (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex items-center mb-8">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-4">
                                    <User className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">{selectedApt.patient}</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paciente Seleccionado</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3">Resumen IA MediBot</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"{selectedApt.aiSummary}"</p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedApt.id, 'presentado')}
                                        className="w-full py-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-2xl font-black hover:bg-green-500 hover:text-white transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-widest"
                                    >
                                        <Check className="w-4 h-4" /> <span>Marcar Llegada</span>
                                    </button>
                                    <button
                                        onClick={() => setIsHistoryOpen(true)}
                                        className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                                    >
                                        Ver Historial
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <CalIcon className="w-16 h-16 mx-auto mb-6 opacity-10" />
                            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Selecciona una cita<br />para gestionar</p>
                        </div>
                    )}
                </div>
            </div>

            <NewAppointmentModal
                isOpen={isNewAptOpen}
                onClose={() => { setIsNewAptOpen(false); setEditingApt(null); }}
                onSave={handleAddAppointment}
                patients={patients}
                onAddPatient={onAddPatient}
            />

            <PatientHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                patient={selectedApt}
            />
        </div>
    );
}

function PlusIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
}
