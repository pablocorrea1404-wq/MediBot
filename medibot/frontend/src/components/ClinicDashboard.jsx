import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    Activity,
    Clock,
    UserPlus,
    CalendarCheck,
    ChevronRight,
    AlertCircle,
    DollarSign,
    Download
} from 'lucide-react';

export default function ClinicDashboard({ onNavigate, patients, appointments, onOpenPatientModal, onOpenAppointmentModal }) {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        todayAppointments: 0,
        totalPatients: 0,
        pendingCitations: 0,
        totalRevenue: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    useEffect(() => {
        if (!appointments || !patients) return;

        // Process Stats from PROPS (Real-time sync)
        const todayApps = appointments.filter(app => {
            if (!app.appointmentDate) return false;
            const dateObj = new Date(app.appointmentDate);
            return dateObj.toLocaleDateString('es-ES') === todayStr;
        });

        const pendingCount = appointments.filter(a => a.status === 'pending' || a.status === 'pendiente').length;

        // Revenue calc
        const revenue = appointments.reduce((acc, app) => {
            if (app.status === 'presentado' && app.service && app.service.price) {
                return acc + parseFloat(app.service.price);
            }
            return acc;
        }, 0);

        setStats({
            totalAppointments: appointments.length,
            todayAppointments: todayApps.length,
            totalPatients: patients.length,
            pendingCitations: pendingCount,
            totalRevenue: revenue,
            presentedToday: todayApps.filter(a => a.status === 'presentado').length,
            trends: {
                patients: `+${patients.length % 5} nuevos`,
                pending: pendingCount > 0 ? "Requiere acción" : "Al día"
            }
        });

        // Get next 5 appointments
        const now = new Date();
        const sorted = [...appointments]
            .filter(a => new Date(a.appointmentDate) >= now)
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
            .slice(0, 5)
            .map(a => ({
                id: a.id,
                patient: a.patient?.name || 'Desconocido',
                date: new Date(a.appointmentDate).toLocaleDateString('es-ES'),
                time: new Date(a.appointmentDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                status: a.status,
                notes: a.notes || 'Consulta General'
            }));

        setRecentAppointments(sorted);
    }, [appointments, patients]); // Re-calcula cada vez que cambien los datos globales

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Ingresos Estimados"
                    value={`${stats.totalRevenue.toFixed(2)} €`}
                    icon={<DollarSign className="w-6 h-6" />}
                    color="blue"
                    trend="Basado en servicios"
                    action={
                        <a
                            href="http://127.0.0.1:8000/api/earnings/export"
                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                            title="Exportar Excel"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                    }
                />
                <StatCard
                    title="Pacientes"
                    value={stats.totalPatients}
                    icon={<Users className="w-6 h-6" />}
                    color="purple"
                    trend={stats.trends?.patients || "Actualizado"}
                />
                <StatCard
                    title="Citas para Hoy"
                    value={stats.todayAppointments}
                    icon={<Clock className="w-6 h-6" />}
                    color="green"
                    trend={stats.presentedToday > 0 ? `${stats.presentedToday} ya en clínica` : "Esperando pacientes"}
                />
                <StatCard
                    title="Pendientes"
                    value={stats.pendingCitations}
                    icon={<Activity className="w-6 h-6" />}
                    color="amber"
                    trend={stats.trends?.pending || "Revisar ahora"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Proximas Citas */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Próximas Citas Destacadas</h3>
                        <button
                            onClick={() => onNavigate('calendar')}
                            className="text-blue-600 text-sm font-semibold hover:underline"
                        >
                            Ver todas
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentAppointments.length > 0 ? recentAppointments.map((app) => (
                            <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {app.patient[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{app.patient}</h4>
                                        <p className="text-xs text-gray-500">{app.notes}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-800">{app.time}</p>
                                    <p className="text-xs text-gray-400">{app.date}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-10 text-center text-gray-400">No hay citas próximas programadas.</div>
                        )}
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                        <h3 className="font-bold text-lg mb-2 text-white">¡Bienvenido de nuevo!</h3>
                        <p className="text-blue-100 text-sm mb-6">Tienes {stats.todayAppointments} pacientes esperándote hoy. ¿Quieres empezar?</p>
                        <button
                            onClick={() => onNavigate('calendar')}
                            className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl shadow-md hover:bg-blue-50 transition-all flex items-center justify-center"
                        >
                            Ver Agenda <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Atajos Rápidos</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickAction
                                icon={<UserPlus className="w-5 h-5" />}
                                label="Nuevo Paciente"
                                color="blue"
                                onClick={onOpenPatientModal}
                            />
                            <QuickAction
                                icon={<CalendarCheck className="w-5 h-5" />}
                                label="Agendar Cita"
                                color="green"
                                onClick={onOpenAppointmentModal}
                            />
                            <a
                                href="http://127.0.0.1:8000/api/earnings/export"
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all space-y-2 w-full text-center"
                            >
                                <div className="text-blue-600"><Download className="w-5 h-5" /></div>
                                <span className="text-xs font-bold text-gray-700">Exportar Caja</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, trend, action }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        amber: "bg-amber-50 text-amber-600"
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                    {trend}
                </span>
                {action}
            </div>
            <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
    );
}

function QuickAction({ icon, label, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all space-y-2 w-full"
        >
            <div className={`text-${color}-600`}>{icon}</div>
            <span className="text-xs font-bold text-gray-700">{label}</span>
        </button>
    );
}
