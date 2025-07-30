"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    doctors: any[];
    appointment: any | null;
}
export function ScheduleAppointmentModal({ isOpen, onClose, onSubmit, doctors, appointment }: ModalProps) {
    const [formData, setFormData] = useState({ patientName: '', doctorId: '', time: '', date: '' });
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
    
    useEffect(() => {
        const initialDate = appointment ? new Date(appointment.date) : new Date();
        setSelectedDay(initialDate);
        setFormData({
            patientName: appointment?.patientName || '',
            doctorId: appointment?.doctorId || '',
            time: appointment?.time || '',
            date: format(initialDate, 'yyyy-MM-dd'),
        });
    }, [appointment, isOpen]);

    if (!isOpen) return null;

    const handleDaySelect = (day: Date | undefined) => {
        setSelectedDay(day);
        if (day) {
            setFormData(prev => ({ ...prev, date: format(day, 'yyyy-MM-dd') }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.doctorId) {
            alert("Please select a doctor.");
            return;
        }
        onSubmit(formData);
    };
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-3xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6">{appointment ? 'Reschedule Appointment' : 'Schedule New Appointment'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex justify-center items-center">
                        <DayPicker mode="single" selected={selectedDay} onSelect={handleDaySelect} className="p-0" />
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="patientName" className="block text-sm font-medium text-gray-300 mb-1">Patient Name</label>
                            <input type="text" id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-300 mb-1">Doctor</label>
                            <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required>
                                <option value="" disabled>Select a doctor</option>
                                {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                            <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required />
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-2.5 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                {appointment ? 'Update Appointment' : 'Schedule Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
