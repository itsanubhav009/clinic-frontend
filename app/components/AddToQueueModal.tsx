"use client";
import { useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { patientName: string; priority: string; arrival: string; estWait: string; appointmentId?: number }) => void;
    appointmentPatients: any[];
}
export function AddToQueueModal({ isOpen, onClose, onSubmit, appointmentPatients }: ModalProps) {
    const [patientType, setPatientType] = useState('walkin');
    const [walkinName, setWalkinName] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState('');
    const [priority, setPriority] = useState('Normal');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let patientName: string;
        let arrivalTime: string;
        let appointmentId: number | undefined;

        if (patientType === 'walkin') {
            patientName = walkinName;
            arrivalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            const [id, name, time] = selectedAppointment.split('||');
            patientName = name;
            arrivalTime = time;
            appointmentId = parseInt(id, 10);
        }
        
        if (!patientName) {
            alert('Please select or enter a patient name.');
            return;
        }

        onSubmit({
            patientName,
            priority,
            arrival: arrivalTime,
            estWait: patientType === 'walkin' ? '15 min' : 'Scheduled',
            appointmentId: appointmentId
        });
        
        setWalkinName('');
        setSelectedAppointment('');
        setPriority('Normal');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6">Add Patient to Queue</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Patient Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2"><input type="radio" value="walkin" checked={patientType === 'walkin'} onChange={(e) => setPatientType(e.target.value)} /> Walk-in</label>
                            <label className="flex items-center gap-2"><input type="radio" value="appointment" checked={patientType === 'appointment'} onChange={(e) => setPatientType(e.target.value)} /> Appointment</label>
                        </div>
                    </div>

                    {patientType === 'walkin' ? (
                        <div>
                            <label htmlFor="walkinName" className="block text-sm font-medium text-gray-300 mb-1">Patient Name</label>
                            <input type="text" id="walkinName" value={walkinName} onChange={(e) => setWalkinName(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="appointmentPatient" className="block text-sm font-medium text-gray-300 mb-1">Select Patient</label>
                            <select id="appointmentPatient" value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required>
                                <option value="" disabled>Select from today's appointments...</option>
                                {appointmentPatients.map(p => <option key={p.id} value={`${p.id}||${p.patientName}||${p.time}`}>{p.patientName} (at {p.time})</option>)}
                            </select>
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md">
                            <option>Normal</option>
                            <option>Urgent</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-2.5 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Add to Queue</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
