"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAppointmentsByDoctor, updateAppointment } from '../lib/api';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: any;
    onAppointmentUpdate: () => void;
}
export function DoctorScheduleModal({ isOpen, onClose, doctor, onAppointmentUpdate }: ModalProps) {
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchSchedule = async () => {
        if (!doctor) return;
        setIsLoading(true);
        try {
            const res = await getAppointmentsByDoctor(doctor.id);
            setSchedule(res.data);
        } catch (error) {
            console.error("Failed to fetch doctor's schedule", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            fetchSchedule();
        }
    }, [isOpen, doctor]);

    const handleCancel = async (id: number) => {
        if(confirm('Are you sure you want to cancel this appointment from the schedule?')) {
            try {
                await updateAppointment(id, { status: 'Canceled'});
                fetchSchedule(); 
                onAppointmentUpdate();
            } catch (error) {
                console.error("Failed to cancel appointment", error);
                alert("Could not cancel the appointment.");
            }
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6">Active Schedule for {doctor.name}</h2>
                {isLoading ? <p>Loading schedule...</p> : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {schedule.length > 0 ? schedule.map((app: any) => (
                            <div key={app.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{app.patientName}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(app.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className="font-semibold text-lg text-white">{app.time}</span>
                                     <button onClick={() => handleCancel(app.id)} className="p-2 text-gray-400 rounded-md bg-red-500/10 hover:bg-red-500/30 hover:text-red-300">
                                        Cancel
                                     </button>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-400 py-4">No active appointments scheduled for {doctor.name}.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
