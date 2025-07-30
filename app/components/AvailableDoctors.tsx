"use client";
import { useState, useEffect } from 'react';
import { getDoctors } from '../lib/api';
import { DoctorScheduleModal } from './DoctorScheduleModal';
const statusStyles: { [key: string]: string } = {
    Available: "bg-green-500/20 text-green-400",
    Busy: "bg-yellow-500/20 text-yellow-400",
    "Off Duty": "bg-gray-600/20 text-gray-400",
};
export function AvailableDoctors({ onUpdate }: { onUpdate: () => void; }) {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        getDoctors({}).then(res => { setDoctors(res.data); setIsLoading(false); })
        .catch(err => { console.error(err); setIsLoading(false); });
    }, []);

    const handleViewSchedule = (doctor: any) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    if (isLoading) return <div className="bg-gray-800 rounded-lg p-6 shadow-lg"><p>Loading Doctors...</p></div>;
    return (
        <>
            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Doctor Status</h2>
                <div className="space-y-4">
                    {doctors.map((doc: any) => (
                        <div key={doc.id} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
                                <div>
                                    <p className="font-semibold">{doc.name}</p>
                                    <p className="text-sm text-gray-400">{doc.specialization}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusStyles[doc.status]}`}>{doc.status}</span>
                               <p className="text-sm text-gray-300 hidden md:block">Next available: <span className="font-semibold text-white">{doc.nextAvailable}</span></p>
                               <button onClick={() => handleViewSchedule(doc)} className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-md">View Schedule</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {selectedDoctor && (
                <DoctorScheduleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    doctor={selectedDoctor}
                    onAppointmentUpdate={onUpdate}
                />
            )}
        </>
    );
}
