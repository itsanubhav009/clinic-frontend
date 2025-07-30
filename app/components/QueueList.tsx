"use client";
import { useState, useEffect } from 'react';
import { UserPlus, X, AlertTriangle } from 'lucide-react';
import { getQueue, addPatientToQueue, removePatientFromQueue, updatePatientInQueue, getDoctors, getAppointments } from '../lib/api';
import { AddToQueueModal } from './AddToQueueModal';
import { format } from 'date-fns';

export function QueueList({ onUpdate }: { onUpdate: () => void; }) {
    const [queue, setQueue] = useState<any[]>([]);
    const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
    const [todaysAppointments, setTodaysAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [queueRes, doctorsRes, appointmentsRes] = await Promise.all([
                getQueue(),
                getDoctors({ status: 'Available' }),
                getAppointments({ date: format(new Date(), 'yyyy-MM-dd') })
            ]);

            const sortedQueue = queueRes.data.sort((a: any, b: any) => {
                if (a.priority === 'Urgent' && b.priority !== 'Urgent') return -1;
                if (a.priority !== 'Urgent' && b.priority === 'Urgent') return 1;
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
            setQueue(sortedQueue);
            setAvailableDoctors(doctorsRes.data);

            const appointmentPatientsInQueue = new Set(sortedQueue.map(p => p.patientName));
            const waitingAppointmentPatients = appointmentsRes.data.filter((p: any) => !appointmentPatientsInQueue.has(p.patientName) && p.status === 'Booked');
            setTodaysAppointments(waitingAppointmentPatients);

        } catch (error) { 
            console.error("Failed to fetch data", error);
        } finally { 
            setIsLoading(false); 
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddPatient = async (data: any) => {
        try { 
            await addPatientToQueue(data); 
            fetchData();
            onUpdate();
        } catch (error) { console.error("Failed to add patient", error); }
    };

    const handleUpdatePatient = async (patientId: number, data: any) => {
        try {
            await updatePatientInQueue(patientId, data);
            fetchData();
            onUpdate();
        } catch(error) {
            console.error("Failed to update patient", error);
        }
    };
    
    const handleRemovePatient = async (id: number) => {
        if (confirm('Are you sure you want to remove this patient from the queue?')) {
            try { 
                await removePatientFromQueue(id); 
                fetchData();
                onUpdate();
            } catch (error) { console.error("Failed to remove patient", error); }
        }
    };

    if (isLoading) return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><p>Loading Queue...</p></div>;
    return (
        <>
            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Live Patient Queue</h2>
                <div className="space-y-3">
                    {queue.length > 0 ? queue.map((p: any, index) => (
                        <div key={p.id} className="bg-gray-900 p-3 rounded-lg flex items-center gap-2">
                            <span className="text-gray-400 font-semibold">{index + 1}</span>
                            <div className="flex-grow">
                                <p className="font-semibold flex items-center">{p.patientName} {p.priority === 'Urgent' && <AlertTriangle className="w-4 h-4 text-yellow-400 ml-2"/>}</p>
                                <p className="text-xs text-gray-400">{p.status}</p>
                            </div>
                            
                            <select value={p.priority} onChange={(e) => handleUpdatePatient(p.id, { priority: e.target.value })} className="bg-gray-700 text-sm rounded p-2 focus:outline-none">
                                <option>Normal</option>
                                <option>Urgent</option>
                            </select>
                            
                            {p.status === 'Waiting' && (
                                <select onChange={(e) => handleUpdatePatient(p.id, { doctorId: parseInt(e.target.value), status: 'With Doctor' })} className="bg-gray-700 text-sm rounded p-2 focus:outline-none">
                                    <option value="">Assign Doctor...</option>
                                    {availableDoctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                            )}

                            {p.status === 'With Doctor' && (
                                <button onClick={() => handleUpdatePatient(p.id, { status: 'Completed' })} className="bg-green-600/50 text-white text-xs px-3 py-2 rounded-md hover:bg-green-600/80">
                                    Mark Completed
                                </button>
                            )}
                            
                            <button onClick={() => handleRemovePatient(p.id)} className="p-2 text-gray-400 rounded-md bg-red-500/20 hover:bg-red-500/40"><X size={20} /></button>
                        </div>
                    )) : <p className="text-gray-400">The queue is empty.</p>}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center">
                    Add Patient to Queue
                </button>
            </section>
            <AddToQueueModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPatient}
                appointmentPatients={todaysAppointments}
            />
        </>
    );
}
