import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Clock, Tag, X, Save } from 'lucide-react';

export default function ServiceManagement({ isOpen, onClose }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        price: '',
        durationMinutes: 30
    });

    useEffect(() => {
        if (isOpen) {
            fetchServices();
        }
    }, [isOpen]);

    const fetchServices = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/medical_services');
            const data = await response.json();
            setServices(data['member'] || data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            setLoading(false);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/medical_services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newService.name,
                    description: newService.description,
                    price: newService.price.toString(),
                    durationMinutes: parseInt(newService.durationMinutes)
                })
            });
            if (response.ok) {
                fetchServices();
                setIsAdding(false);
                setNewService({ name: '', description: '', price: '', durationMinutes: 30 });
            }
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
        try {
            await fetch(`http://127.0.0.1:8000/api/medical_services/${id}`, {
                method: 'DELETE'
            });
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all scale-100 overflow-hidden m-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-blue-400" />
                        Gestión de Servicios y Precios
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {isAdding ? (
                        <form onSubmit={handleAddService} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm mb-6 space-y-4 animate-slide-up">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre del Servicio</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: Limpieza Dental profunda"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Precio (€)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            placeholder="50.00"
                                            value={newService.price}
                                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Duración (min)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            required
                                            type="number"
                                            value={newService.durationMinutes}
                                            onChange={(e) => setNewService({ ...newService, durationMinutes: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Descripción</label>
                                    <textarea
                                        placeholder="Breve descripción del tratamiento..."
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 font-medium hover:bg-gray-50 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                                    Guardar Servicio
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full py-4 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 font-bold hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center mb-6 border-spacing-4"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Añadir Nuevo Servicio
                        </button>
                    )}

                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-10 text-gray-400">Cargando servicios...</div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">No hay servicios configurados.</div>
                        ) : (
                            services.map(service => (
                                <div key={service.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Stethoscope className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{service.name}</h4>
                                            <div className="flex items-center space-x-3 mt-0.5">
                                                <span className="text-xs text-gray-400 flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" /> {service.durationMinutes} min
                                                </span>
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    {parseFloat(service.price).toFixed(2)} €
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-100 p-4">
                    <button onClick={onClose} className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        Cerrar Ventana
                    </button>
                </div>
            </div>
        </div>
    );
}

function Stethoscope(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 1 0-.2.3Z" />
            <path d="M3.3 7a5 5 0 0 0 5 5h3a5 5 0 0 0 5-5V3" />
            <circle cx="16" cy="3" r="2" />
            <path d="M8 12v3a5 5 0 0 0 5 5h.5" />
            <circle cx="16" cy="20" r="3" />
        </svg>
    )
}
