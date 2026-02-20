import React, { useState } from 'react';
import { X, User, Briefcase, Mail, UserPlus } from 'lucide-react';

export default function NewStaffModal({ isOpen, onClose, onSave }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: '',
        specialty: 'General',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
        // Reset form
        setFormData({
            name: '',
            specialty: 'General',
            email: ''
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in text-gray-900">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100 overflow-hidden m-4">
                {/* Header */}
                <div className="bg-indigo-900 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="font-semibold text-lg flex items-center">
                        <UserPlus className="w-5 h-5 mr-2 text-indigo-400" />
                        Registrar Profesional
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-indigo-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Dr. García"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Especialidad</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none text-gray-900"
                            >
                                <option>General</option>
                                <option>Odontología</option>
                                <option>Higiene</option>
                                <option>Extracción</option>
                                <option>Blanqueamiento</option>
                                <option>Ortodoncia</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Profesional</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="garcia@clinic.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02]"
                        >
                            Registrar Trabajador
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
