import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, UserPlus, Info, X } from 'lucide-react';
import NewStaffModal from './NewStaffModal';

export default function TeamSchedule() {
    const [staff, setStaff] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStaff, setSelectedStaff] = useState('all');
    const [isNewStaffOpen, setIsNewStaffOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Helper para formatear fecha como string (DD/MM/YYYY) para comparar
    const formatDate = (date) => {
        const d = new Date(date);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const año = d.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const fechaSeleccionadaStr = formatDate(selectedDate);
    const fechaHoyStr = formatDate(new Date());

    // Funciones navegación de fecha
    const goToPrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    // Helper para asignar colores a doctores
    const getDoctorColor = (docName) => {
        if (!docName) return 'gray';
        if (docName.includes('Smith') || docName.includes('Sarah')) return 'blue';
        if (docName.includes('Doe') || docName.includes('Mike')) return 'green';
        if (docName.includes('Ray') || docName.includes('Lisa')) return 'purple';
        return 'indigo';
    };

    // Cargar datos desde la API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Cargar Staff
                const staffRes = await fetch('http://127.0.0.1:8000/api/staff', {
                    headers: { 'Accept': 'application/json' }
                });
                const staffData = await staffRes.json();
                const formattedStaff = staffData.map(s => ({
                    id: s.id,
                    name: s.name,
                    specialty: s.specialty,
                    color: getDoctorColor(s.name)
                }));
                setStaff(formattedStaff);

                // 2. Cargar Citas
                const appRes = await fetch('http://127.0.0.1:8000/api/appointments', {
                    headers: { 'Accept': 'application/json' }
                });
                const appData = await appRes.json();
                const formattedApps = appData.map(apt => {
                    let dateStr = "Fecha inválida";
                    let timeStr = "--:--";
                    if (apt.appointmentDate) {
                        const [isoDate] = apt.appointmentDate.split('T');
                        const [year, month, day] = isoDate.split('-');
                        dateStr = `${day}/${month}/${year}`;
                        const dateObj = new Date(apt.appointmentDate);
                        timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
                    }
                    return {
                        id: apt.id,
                        staffId: apt.staff ? apt.staff.id : null,
                        patient: apt.patient ? apt.patient.name : 'Desconocido',
                        time: timeStr,
                        date: dateStr,
                        procedure: apt.notes ? apt.notes.split('-')[0].trim() : 'Consulta General',
                        status: apt.status === 'confirmed' ? 'Completed' : (apt.status === 'cancelled' ? 'Cancelled' : 'Pending')
                    };
                });
                setAppointments(formattedApps);
            } catch (err) {
                console.error("Error fetching team data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddStaff = async (data) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const newMember = await response.json();
                setStaff(prev => [...prev, {
                    id: newMember.id,
                    name: newMember.name,
                    specialty: newMember.specialty,
                    color: getDoctorColor(newMember.name)
                }]);

                setNotification(`Profesional ${newMember.name} registrado correctamente`);
                setTimeout(() => setNotification(null), 5000);
                return newMember;
            } else {
                const errorData = await response.json();
                alert("Error al registrar trabajador: " + (errorData.detail || "Error desconocido"));
            }
        } catch (err) {
            console.error("Error creating staff:", err);
            alert("Error de conexión al registrar trabajador");
        }
    };

    // Filtrar citas por fecha y doctor
    const filteredTasks = appointments.filter(apt => {
        const matchesDate = apt.date === fechaSeleccionadaStr;
        const matchesStaff = selectedStaff === 'all' || apt.staffId === parseInt(selectedStaff);
        return matchesDate && matchesStaff;
    });

    return (
        <div className="space-y-8">
            {/* Header con Navegación de Fecha */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Horarios del Equipo</h2>
                        <p className="text-sm text-gray-500">Gestiona las citas por profesional</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={goToPrevDay}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={goToToday}
                            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            {fechaSeleccionadaStr === fechaHoyStr ? 'Hoy' : fechaSeleccionadaStr}
                        </button>
                        <button
                            onClick={goToNextDay}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsNewStaffOpen(true)}
                        className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-200"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Registrar Profesional
                    </button>
                </div>
            </div>

            {/* Notificación */}
            {notification && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-indigo-900 text-white px-6 py-3 rounded-xl shadow-2xl border border-indigo-700 flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                        <span className="text-sm font-medium">{notification}</span>
                    </div>
                </div>
            )}

            {/* Modal de Detalles de Cita */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center"><Info className="w-5 h-5 mr-2" /> Detalles de la Cita</h3>
                            <button onClick={() => setSelectedAppointment(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                                    {selectedAppointment.patient[0]}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Paciente</p>
                                    <h4 className="font-bold text-gray-900 text-lg">{selectedAppointment.patient}</h4>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hora</p>
                                    <p className="font-bold text-gray-800 flex items-center"><Clock className="w-3 h-3 mr-2 text-indigo-500" /> {selectedAppointment.time}</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estado</p>
                                    <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">{selectedAppointment.status}</span>
                                </div>
                            </div>

                            <div className="p-4 border border-gray-100 rounded-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Procedimiento / Notas</p>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl">{selectedAppointment.procedure}</p>
                            </div>

                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-colors"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <NewStaffModal
                isOpen={isNewStaffOpen}
                onClose={() => setIsNewStaffOpen(false)}
                onSave={handleAddStaff}
            />

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={() => setSelectedStaff('all')}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center space-x-4 ${selectedStaff === 'all'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-indigo-300'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${selectedStaff === 'all' ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>
                        ALL
                    </div>
                    <div>
                        <h3 className="font-bold">Toda la Clínica</h3>
                        <p className={`text-xs ${selectedStaff === 'all' ? 'text-indigo-100' : 'text-gray-500'}`}>Vista combinada</p>
                    </div>
                </div>

                {staff.map((member) => {
                    const isSelected = selectedStaff === member.id;

                    // Definir clases explícitas para evitar problemas de Tailwind dinámico
                    const colorClasses = {
                        blue: isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-blue-100' : 'bg-white border-gray-200 text-gray-900 shadow-sm',
                        green: isSelected ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-100' : 'bg-white border-gray-200 text-gray-900 shadow-sm',
                        purple: isSelected ? 'bg-purple-600 border-purple-600 text-white shadow-purple-100' : 'bg-white border-gray-200 text-gray-900 shadow-sm',
                        indigo: isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100' : 'bg-white border-gray-200 text-gray-900 shadow-sm'
                    };

                    const dotClasses = {
                        blue: isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600',
                        green: isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600',
                        purple: isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600',
                        indigo: isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'
                    };

                    const selectedColor = member.color || 'indigo';

                    return (
                        <div
                            key={member.id}
                            onClick={() => setSelectedStaff(member.id)}
                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg ${colorClasses[selectedColor] || colorClasses.indigo} ${isSelected ? 'scale-105 z-10' : 'hover:border-gray-300'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${dotClasses[selectedColor] || dotClasses.indigo}`}>
                                    {member.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-extrabold text-lg leading-tight">{member.name}</h3>
                                    <p className={`text-sm font-medium transition-colors ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                        {member.specialty}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Schedule List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                        {selectedStaff === 'all' ? "Agenda General de la Clínica" : `Agenda: ${staff.find(s => s.id === selectedStaff)?.name}`}
                    </h3>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{fechaSeleccionadaStr}</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Cargando horarios...
                    </div>
                ) : error ? (
                    <div className="p-12 text-center text-red-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">Error al conectar con la clínica</p>
                        <p className="text-sm opacity-70">{error}</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="p-16 text-center text-gray-400">
                        <Clock className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="font-medium">No hay citas para esta selección</p>
                        <p className="text-sm mt-1">Prueba a cambiar la fecha o el profesional</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredTasks.map((task) => {
                            const staffMember = staff.find(s => s.id === task.staffId);
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => setSelectedAppointment(task)}
                                    className="p-6 flex items-center justify-between hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className="flex flex-col items-center justify-center min-w-[70px] py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-white transition-colors">
                                            <span className="text-sm font-bold text-indigo-600">{task.time}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{task.patient}</p>
                                            <p className="text-sm text-gray-500">{task.procedure}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-8">
                                        <div className="hidden md:flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-full bg-${staffMember?.color || 'gray'}-100 flex items-center justify-center`}>
                                                <User className={`w-4 h-4 text-${staffMember?.color || 'gray'}-600`} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{staffMember?.name}</span>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                            task.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {task.status === 'Completed' ? 'Completada' : task.status === 'Cancelled' ? 'Cancelada' : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
