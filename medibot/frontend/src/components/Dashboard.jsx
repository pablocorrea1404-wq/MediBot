/**
 * COMPONENTE DASHBOARD (Panel Principal)
 * Gestiona el estado global de la aplicación y las notificaciones.
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Activity, Settings, Zap, Briefcase, LayoutDashboard, Tag } from 'lucide-react';
import AppointmentCalendar from './AppointmentCalendar';
import PatientTable from './PatientTable';
import TeamSchedule from './TeamSchedule';
import ClinicDashboard from './ClinicDashboard';
import ServiceManagement from './ServiceManagement';

export default function Dashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
    const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);

    // ESTADO GLOBAL
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // FUNCIÓN DE NOTIFICACIÓN
    const notify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 4000);
    };

    // CARGA INICIAL
    const fetchData = async () => {
        try {
            console.log("Cargando datos globales...");
            const [pRes, aRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/patients', { headers: { 'Accept': 'application/json' } }),
                fetch('http://127.0.0.1:8000/api/appointments', { headers: { 'Accept': 'application/json' } })
            ]);

            const pData = await pRes.json();
            const aData = await aRes.json();

            setPatients(Array.isArray(pData) ? pData : (pData['member'] || pData['hydra:member'] || []));
            setAppointments(Array.isArray(aData) ? aData : (aData['member'] || aData['hydra:member'] || []));
        } catch (err) {
            console.error("Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // GESTIÓN DE PACIENTES (CENTRALIZADA)
    const handleAddPatient = async (data) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const newPatient = await response.json();
                setPatients(prev => [...prev, newPatient]);
                notify(`✅ Paciente ${newPatient.name} registrado correctamente`);
                return newPatient;
            }
        } catch (err) {
            console.error("Error:", err);
            notify("❌ Error al conectar con el servidor");
        }
        return null;
    };

    const handleEditPatient = async (id, data) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/patients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const updated = await response.json();
                setPatients(prev => prev.map(p => (p.id === id || p['@id']?.split('/').pop() === id.toString()) ? updated : p));
                notify(`✅ Paciente actualizado con éxito`);
                return updated;
            }
        } catch (err) {
            console.error("Error editing patient:", err);
            notify("❌ Error al actualizar el paciente");
        }
    };

    const handleDeletePatient = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar a este paciente? Esta acción no se puede deshacer.")) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/patients/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPatients(prev => prev.filter(p => (p.id !== id && p['@id']?.split('/').pop() !== id.toString())));
                notify("🗑️ Paciente eliminado correctamente");
            } else {
                notify("❌ No se pudo eliminar (posiblemente tenga citas)");
            }
        } catch (err) {
            console.error("Error deleting patient:", err);
            notify("❌ Error de comunicación con el servidor");
        }
    };

    // GESTIÓN DE CITAS (CENTRALIZADA)
    const handleSaveAppointment = async (newApt) => {
        // Actualizar la lista local de citas
        setAppointments(prev => {
            const exists = prev.find(a => a.id === newApt.id);
            if (exists) return prev.map(a => a.id === newApt.id ? newApt : a);
            return [...prev, newApt];
        });

        // Buscar el nombre del paciente para el mensaje
        const patientName = patients.find(p => p.id === newApt.patient?.id || p['@id'] === newApt.patient)?.name || "Paciente";
        notify(`📅 Cita agendada con éxito para ${patientName}`);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-900">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-blue-400 font-bold animate-pulse text-sm uppercase tracking-widest">Iniciando MediBot PRO...</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans relative overflow-hidden">
            {/* NOTIFICACION FLOTANTE */}
            {notification && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-700 flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ring-4 ring-blue-500/20"></div>
                        <span className="text-sm font-bold tracking-tight">{notification}</span>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
                <div className="p-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                            <Zap className="w-6 h-6 text-white fill-current" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">MediBot <span className="text-blue-500">PRO</span></h1>
                    </div>
                </div>

                <nav className="mt-4 flex-1 px-4 space-y-1">
                    <NavButton active={activeTab === 'dashboard'} icon={<LayoutDashboard />} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
                    <NavButton active={activeTab === 'calendar'} icon={<Calendar />} label="Agenda" onClick={() => setActiveTab('calendar')} />
                    <NavButton active={activeTab === 'patients'} icon={<Users />} label="Pacientes" onClick={() => setActiveTab('patients')} />
                    <NavButton active={activeTab === 'team'} icon={<Briefcase />} label="Equipo" onClick={() => setActiveTab('team')} />
                    <button
                        onClick={() => setIsServiceModalOpen(true)}
                        className="flex items-center w-full px-4 py-4 text-sm font-bold rounded-2xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white mt-4"
                    >
                        <Tag className="w-5 h-5 mr-3" /> Servicios & Precios
                    </button>
                </nav>

                <div className="p-6 bg-slate-950">
                    <button onClick={onLogout} className="w-full py-4 bg-red-500/10 text-red-500 text-xs font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 uppercase tracking-widest">
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-10 py-6 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{activeTab}</h2>
                    <div className="flex items-center space-x-4 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-black text-green-700 uppercase tracking-widest">Servidor Activo</span>
                    </div>
                </header>

                <main className="p-10 max-w-7xl mx-auto w-full flex-1">
                    {activeTab === 'dashboard' && (
                        <ClinicDashboard
                            onNavigate={setActiveTab}
                            patients={patients}
                            appointments={appointments}
                            onOpenPatientModal={() => { setActiveTab('patients'); setIsNewPatientModalOpen(true); }}
                            onOpenAppointmentModal={() => { setActiveTab('calendar'); setIsNewAppointmentModalOpen(true); }}
                        />
                    )}
                    {activeTab === 'calendar' && (
                        <AppointmentCalendar
                            patients={patients}
                            sharedAppointments={appointments}
                            onSaveAppointment={handleSaveAppointment}
                            onAddPatient={handleAddPatient}
                            isNewAptOpen={isNewAppointmentModalOpen}
                            setIsNewAptOpen={setIsNewAppointmentModalOpen}
                        />
                    )}
                    {activeTab === 'patients' && (
                        <PatientTable
                            patients={patients}
                            onAddPatient={handleAddPatient}
                            onEditPatient={handleEditPatient}
                            onDeletePatient={handleDeletePatient}
                            isNewPatientOpen={isNewPatientModalOpen}
                            setIsNewPatientOpen={setIsNewPatientModalOpen}
                        />
                    )}
                    {activeTab === 'team' && <TeamSchedule />}
                </main>
            </div>

            <ServiceManagement isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} />
        </div>
    );
}

function NavButton({ active, icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-4 text-sm font-bold rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1' : 'text-slate-500 hover:bg-slate-100'}`}
        >
            {React.cloneElement(icon, { className: `w-5 h-5 mr-3 ${active ? 'text-white' : 'text-slate-400'}` })}
            {label}
        </button>
    );
}
