import React, { useState } from 'react';
import { Search, MoreVertical, FileText, UserPlus, Edit, Trash2, HeartPulse } from 'lucide-react';
import PatientHistoryModal from './PatientHistoryModal';
import NewPatientModal from './NewPatientModal';

export default function PatientTable({ patients = [], onAddPatient, onDeletePatient, onEditPatient, isNewPatientOpen, setIsNewPatientOpen }) {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleViewHistory = (patient) => {
        setSelectedPatient({ ...patient, patient: patient.name });
        setIsHistoryOpen(true);
    };

    const handleEditClick = (patient) => {
        setEditingPatient(patient);
        setIsNewPatientOpen(true);
    };

    const handleSavePatient = async (data) => {
        if (editingPatient) {
            await onEditPatient(editingPatient.id || editingPatient['@id']?.split('/').pop(), data);
        } else {
            await onAddPatient(data);
        }
        setEditingPatient(null);
        setIsNewPatientOpen(false);
    };

    const handleDelete = async (id) => {
        if (onDeletePatient) {
            await onDeletePatient(id);
        }
    };

    const filteredPatients = Array.isArray(patients) ? patients.filter(patient =>
        (patient.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (patient.dni?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions */}
            <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
                        <HeartPulse className="w-6 h-6 mr-3 text-blue-500" />
                        Base de Datos de Pacientes
                    </h3>
                    <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">{filteredPatients.length} pacientes registrados actualmente</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-blue-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o DNI..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all w-full md:w-80 font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setIsNewPatientOpen(true)}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 uppercase tracking-widest active:scale-95"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Añadir Paciente
                    </button>
                </div>
            </div>

            {/* Patients Grid/Table */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paciente / DNI</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contacto</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Última Visita</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id || patient['@id']} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black mr-4 text-sm shadow-sm">
                                                    {(patient.name || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-800 text-lg tracking-tight">{patient.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{patient.dni}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-slate-700 font-bold text-sm">{patient.email}</span>
                                                <span className="text-slate-400 text-xs mt-1">{patient.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-slate-500 text-sm font-medium">{patient.lastVisit || 'Hoy'}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleViewHistory(patient)}
                                                    className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-blue-200"
                                                    title="Ver Historial"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(patient)}
                                                    className="p-3 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-amber-200"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(patient.id || patient['@id']?.split('/').pop())}
                                                    className="p-3 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-red-200"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                <Search className="w-8 h-8" />
                                            </div>
                                            <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">Sin resultados</h4>
                                            <p className="text-sm text-slate-300 mt-2 font-medium">No se han encontrado pacientes que coincidan con "{searchTerm}"</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PatientHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                patient={selectedPatient}
            />

            <NewPatientModal
                isOpen={isNewPatientOpen}
                onClose={() => { setIsNewPatientOpen(false); setEditingPatient(null); }}
                onSave={handleSavePatient}
                initialData={editingPatient}
            />
        </div>
    );
}
