import React from 'react';
import { X, Calendar, FileText, CheckCircle, Clock, Image as ImageIcon } from 'lucide-react';

export default function PatientHistoryModal({ isOpen, onClose, patient }) {
    if (!isOpen || !patient) return null;

    const [history, setHistory] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [newRecord, setNewRecord] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);

    const fetchAllData = async () => {
        if (!patient?.patientId) return;
        setLoading(true);
        try {
            // Cargar Citas
            const aptRes = await fetch(`http://127.0.0.1:8000/api/appointments?patient=/api/patients/${patient.patientId}`);
            const aptData = await aptRes.json();

            // Cargar Historial (MedicalRecords)
            const recRes = await fetch(`http://127.0.0.1:8000/api/medical_records?patient=/api/patients/${patient.patientId}`);
            const recData = await recRes.json();

            // Mapear y combinar
            const appointments = aptData.map(apt => ({
                id: `apt-${apt.id}`,
                date: new Date(apt.appointmentDate),
                type: 'Cita',
                doctor: apt.staff ? apt.staff.name : 'Personal',
                content: apt.notesIa || apt.notes || 'Consulta registrada',
                status: apt.status,
                isNote: false
            }));

            const notes = (recData['member'] || recData).map(rec => ({
                id: `rec-${rec.id}`,
                date: new Date(rec.createdAt),
                type: 'Nota Médica',
                doctor: 'Dr. Admin',
                content: rec.content,
                imageUrl: rec.imageUrl,
                status: 'finalized',
                isNote: true
            }));

            const combined = [...appointments, ...notes].sort((a, b) => b.date - a.date);
            setHistory(combined);
        } catch (err) {
            console.error("Error cargando historial:", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (isOpen) fetchAllData();
    }, [isOpen, patient]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newRecord.trim()) return;

        setIsSaving(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/medical_records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient: `/api/patients/${patient.patientId}`,
                    content: newRecord,
                    imageUrl: imageUrl
                })
            });
            if (response.ok) {
                setNewRecord('');
                setImageUrl('');
                fetchAllData();
            }
        } catch (err) {
            console.error("Error saving note:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all scale-100 overflow-hidden m-4">
                {/* Header */}
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                            {patient.patient.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">{patient.patient}</h3>
                            <p className="text-blue-200 text-xs">Medical History & Logs</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto p-6 bg-gray-50">
                    <div className="space-y-6">
                        {/* Add Note Form */}
                        <form onSubmit={handleAddNote} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-3">
                            <label className="text-xs font-bold text-blue-600 uppercase">Añadir Nota Clínica</label>
                            <textarea
                                value={newRecord}
                                onChange={(e) => setNewRecord(e.target.value)}
                                placeholder="Describa el tratamiento realizado o diagnóstico..."
                                className="w-full p-3 text-sm border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none bg-gray-50"
                            />
                            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="URL de imagen (adjuntar prueba, RX...)"
                                    className="flex-1 bg-transparent text-xs outline-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    disabled={isSaving || !newRecord.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar Nota'}
                                </button>
                            </div>
                        </form>

                        <div className="border-t border-gray-200 my-4"></div>
                        {/* Timeline */}
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
                            {history.map((record) => (
                                <div key={record.id} className="relative pl-8">
                                    {/* Dot */}
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-500"></div>

                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                                    {record.type}
                                                </span>
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" /> {record.date.toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-medium flex items-center px-2 py-0.5 rounded-full border ${record.isNote ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                <CheckCircle className="w-3 h-3 mr-1" /> {record.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Registrado por: {record.doctor}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {record.content}
                                        </p>
                                        {record.imageUrl && (
                                            <div className="mt-4 rounded-lg overflow-hidden border border-gray-100">
                                                <img
                                                    src={record.imageUrl}
                                                    alt="Adjunto médico"
                                                    className="w-full h-auto max-h-64 object-cover hover:scale-105 transition-transform cursor-pointer"
                                                    onClick={() => window.open(record.imageUrl, '_blank')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                View older records...
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-200 p-4 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
