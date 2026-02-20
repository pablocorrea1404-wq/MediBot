import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, Stethoscope, Clock } from 'lucide-react';

export default function NewAppointmentModal({ isOpen, onClose, onSave, patients = [], onAddPatient, initialData }) {
    const [mode, setMode] = useState('existing'); // 'existing' or 'new'
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState([]);
    const [newPatientData, setNewPatientData] = useState({ name: '', dni: '', email: '', phone: '' });

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: '',
        type: 'General',
        doctor: 'Dr. Doe',
        notes: '',
        serviceId: ''
    });

    useEffect(() => {
        if (!isOpen) return;
        fetch('http://127.0.0.1:8000/api/medical_services')
            .then(res => res.json())
            .then(data => setServices(Array.isArray(data) ? data : (data['member'] || data['hydra:member'] || [])))
            .catch(err => console.error("Error loading services:", err));
    }, [isOpen]);

    useEffect(() => {
        if (initialData && isOpen) {
            const [day, month, year] = initialData.date.split('/');
            const isoDate = `${year}-${month}-${day}`;
            setFormData({
                date: isoDate,
                time: initialData.time || '',
                type: initialData.type || 'General',
                doctor: initialData.doctor || 'Dr. Doe',
                notes: initialData.notes || '',
                serviceId: initialData.service?.id || initialData.service?.['@id']?.split('/').pop() || ''
            });
            if (initialData.patientId) setSelectedPatientId(initialData.patientId.toString());
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const isValid = mode === 'existing'
        ? selectedPatientId !== ''
        : (newPatientData.name && newPatientData.dni);

    const handleNewPatientChange = (e) => {
        const { name, value } = e.target;
        setNewPatientData(prev => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dni.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        let finalPatientId = '';

        if (mode === 'new') {
            const newPatient = await onAddPatient(newPatientData);
            if (!newPatient) return;
            finalPatientId = newPatient.id || newPatient['@id']?.split('/').pop();
        } else {
            finalPatientId = selectedPatientId;
        }

        await onSave({
            ...formData,
            patientId: finalPatientId,
            serviceId: formData.serviceId
        });

        onClose();
        // Reset
        setMode('existing');
        setSelectedPatientId('');
        setNewPatientData({ name: '', dni: '', email: '', phone: '' });
        setFormData({
            date: new Date().toISOString().split('T')[0],
            time: '', type: 'General', doctor: 'Dr. Doe', notes: '', serviceId: ''
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300 p-4">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_32px_64px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest flex items-center">
                            <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                            {initialData ? 'Editar Cita' : 'Nueva Cita'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                    {/* Segmento Paciente */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Paciente</span>
                        {!initialData && (
                            <div className="flex bg-slate-200 p-1.5 rounded-2xl mb-4">
                                <button type="button" onClick={() => setMode('existing')} className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${mode === 'existing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Existente</button>
                                <button type="button" onClick={() => setMode('new')} className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${mode === 'new' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>+ Nuevo</button>
                            </div>
                        )}

                        {mode === 'existing' ? (
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o DNI..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>

                                {searchTerm && (
                                    <div className="max-h-48 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-inner p-2 space-y-1">
                                        {filteredPatients.length > 0 ? filteredPatients.map(p => (
                                            <button
                                                key={p.id || p['@id']}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPatientId(p.id || p['@id']?.split('/').pop());
                                                    setSearchTerm(p.name);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${selectedPatientId === (p.id || p['@id']?.split('/').pop()) ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                                            >
                                                {p.name} <span className="opacity-50 ml-2 font-mono text-xs">{p.dni}</span>
                                            </button>
                                        )) : (
                                            <p className="p-4 text-center text-xs text-slate-400 font-bold uppercase italic">Sin resultados</p>
                                        )}
                                    </div>
                                )}

                                {selectedPatientId && !searchTerm.includes(patients.find(p => (p.id || p['@id']?.split('/').pop()) === selectedPatientId)?.name) && (
                                    <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                                        <span className="text-xs font-bold text-blue-700">Seleccionado: {patients.find(p => (p.id || p['@id']?.split('/').pop()) === selectedPatientId)?.name}</span>
                                        <button type="button" onClick={() => { setSelectedPatientId(''); setSearchTerm(''); }} className="text-blue-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input required type="text" name="name" placeholder="Nombre Completo" value={newPatientData.name} onChange={handleNewPatientChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold" />
                                <input required type="text" name="dni" placeholder="DNI / NIE" value={newPatientData.dni} onChange={handleNewPatientChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold font-mono" />
                            </div>
                        )}
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Fecha</label>
                            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Hora</label>
                            <input required type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                        </div>
                    </div>

                    {/* Servicio */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tipo de Servicio</label>
                        <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none">
                            <option value="">Selecciona un servicio...</option>
                            {services.map(s => <option key={s.id || s['@id']} value={s.id || s['@id']?.split('/').pop()}>{s.name} - {parseFloat(s.price).toFixed(2)}€</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Notas Especiales</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Detalles de la consulta..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold h-24 resize-none" />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Cancelar</button>
                        <button type="submit" disabled={!isValid} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isValid ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700' : 'bg-slate-100 text-slate-300'}`}>
                            {initialData ? 'Guardar Cambios' : 'Agendar Cita'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
