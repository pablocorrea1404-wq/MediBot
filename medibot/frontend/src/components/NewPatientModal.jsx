import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, FileText, UserPlus } from 'lucide-react';

export default function NewPatientModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        dni: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                name: initialData.name || '',
                dni: initialData.dni || '',
                email: initialData.email || '',
                phone: initialData.phone || ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        // Reset form
        setFormData({ name: '', dni: '', email: '', phone: '' });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300 p-4">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_32px_64px_rgba(0,0,0,0.2)] overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center">
                        <UserPlus className="w-5 h-5 mr-3 text-blue-500" />
                        {initialData ? 'Editar Paciente' : 'Nuevo Paciente'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nombre Completo</label>
                            <input required name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">DNI / ID</label>
                            <input required name="dni" value={formData.dni} onChange={handleChange} placeholder="12345678X" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email</label>
                                <input name="email" value={formData.email} onChange={handleChange} placeholder="juan@email.com" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Teléfono</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="600000000" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Cancelar</button>
                        <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                            {initialData ? 'Guardar Cambios' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
