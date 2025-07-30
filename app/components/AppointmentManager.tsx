"use client";
import { useState, useEffect } from 'react';
import { UserPlus, Edit } from 'lucide-react';
import { getAppointments, createAppointment, updateAppointment, getDoctors, addPatientToQueue } from '../lib/api';
import { ScheduleAppointmentModal } from './ScheduleAppointmentModal';
import { format } from 'date-fns';

export function AppointmentManager({ onUpdate }: { onUpdate?: () => void }) {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [queuedAppointmentIds, setQueuedAppointmentIds] = useState<Set<number>>(new Set());
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const params = { search: searchTerm };
            const res = await getAppointments(params);
            setAppointments(res.data);
        } catch (error) { console.error("Failed to fetch appointments", error); }
        finally { setIsLoading(false); }
    };

    const fetchDoctors = async () => {
        try { const res = await getDoctors({}); setDoctors(res.data); }
        catch (error) { console.error("Failed to fetch doctors", error); }
    };

    useEffect(() => {
        const handler = setTimeout(() => { fetchAppointments(); }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => { fetchDoctors(); fetchAppointments(); }, []);

    const handleOpenModal = (appointment: any = null) => {
        setEditingAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingAppointment(null);
        setIsModalOpen(false);
    };

    const handleSaveAppointment = async (data: any) => {
        try {
            const submissionData = { ...data, doctorId: parseInt(data.doctorId, 10) };
            if (editingAppointment) {
                await updateAppointment((editingAppointment as any).id, submissionData);
            } else {
                await createAppointment(submissionData);
            }
            fetchAppointments();
            if (onUpdate) onUpdate();
            handleCloseModal();
        } catch (error: any) {
            console.error("Failed to save appointment", error);
            alert(`Could not save appointment: ${error.response?.data?.message || error.message}`);
        }
    };
    
    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await updateAppointment(id, { status });
            fetchAppointments();
            if (onUpdate) onUpdate();
        } catch(error) {
            console.error("Failed to update status", error);
            alert("Could not update appointment status.");
        }
    };

    const handleAddToQueue = async (appointment: any) => {
        const newPatient = {
            patientName: appointment.patientName,
            arrival: appointment.time,
            estWait: 'Scheduled',
            appointmentId: appointment.id
        };
        try {
            await addPatientToQueue(newPatient);
            setQueuedAppointmentIds(prev => new Set(prev).add(appointment.id));
            if(onUpdate) onUpdate();
            alert(`${appointment.patientName} has been added to the live queue.`);
        } catch (error) {
            console.error("Failed to add patient to queue", error);
            alert("Could not add patient to the queue.");
        }
    };

    const todayString = format(new Date(), 'yyyy-MM-dd');

    return (
        <>
            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Appointment Management</h2>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        <UserPlus size={18} /> New Appointment
                    </button>
                </div>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by patient or doctor..." className="w-full bg-gray-700 px-4 py-2 rounded-md mb-6" />
                {isLoading ? <p>Loading Appointments...</p> : (
                    <div className="space-y-3">
                        {appointments.length > 0 ? appointments.map((app: any) => {
                            const isFinalized = app.status !== 'Booked';
                            const isToday = app.date === todayString;
                            const isQueued = queuedAppointmentIds.has(app.id);
                            return (
                                <div key={app.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                                    <div className={isFinalized ? 'text-gray-500 line-through' : ''}>
                                        <p className="font-semibold">{app.patientName}</p>
                                        <p className="text-sm">{`Dr. ${app.doctorName}`} - {new Date(app.date + 'T' + app.time).toLocaleDateString()} at {app.time}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isToday && app.status === 'Booked' && (
                                            <button 
                                                onClick={() => handleAddToQueue(app)}
                                                disabled={isQueued}
                                                className="p-2 text-gray-200 rounded-md bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                                title="Add to Live Queue"
                                            >
                                                <UserPlus size={18} />
                                            </button>
                                        )}
                                        <select 
                                            value={app.status} 
                                            onChange={(e) => handleUpdateStatus(app.id, e.target.value)} 
                                            disabled={isFinalized}
                                            className="bg-gray-700 text-sm rounded-md p-2 focus:outline-none border-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option>Booked</option>
                                            <option>Completed</option>
                                            <option>Canceled</option>
                                        </select>
                                        <button 
                                            onClick={() => handleOpenModal(app)} 
                                            disabled={isFinalized}
                                            className="p-2 text-gray-400 rounded-md hover:bg-blue-500/20 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Reschedule"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    </div>
                                </div>
                            )
                        }) : <p className="text-gray-400">No appointments found.</p>}
                    </div>
                )}
            </section>
            <ScheduleAppointmentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSaveAppointment}
                doctors={doctors}
                appointment={editingAppointment}
            />
        </>
    );
}
