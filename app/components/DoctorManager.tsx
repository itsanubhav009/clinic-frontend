"use client";
import { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from '../lib/api';
import { DoctorFormModal } from './DoctorFormModal';

export function DoctorManager({ onUpdate }: { onUpdate?: () => void; }) {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [filters, setFilters] = useState({ specialization: '', location: '', status: '' });
    
    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            const res = await getDoctors(filters);
            setDoctors(res.data);
        } catch (error) { console.error("Failed to fetch doctors", error); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => fetchDoctors(), 500);
        return () => clearTimeout(handler);
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenModal = (doctor: any = null) => {
        setEditingDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingDoctor(null);
        setIsModalOpen(false);
    };

    const handleSaveDoctor = async (data: any) => {
        try {
            if (editingDoctor) { 
                const { id, ...updateData } = data;
                await updateDoctor((editingDoctor as any).id, updateData); 
            } else { 
                await addDoctor(data); 
            }
            fetchDoctors();
            if (onUpdate) onUpdate();
            handleCloseModal();
        } catch (error: any) { 
            console.error("Failed to save doctor", error); 
            alert(`Failed to save doctor profile: ${error.response?.data?.message?.[0] || 'Server error'}`);
        }
    };

    const handleDeleteDoctor = async (id: number) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            try { 
                await deleteDoctor(id);
                fetchDoctors();
                if (onUpdate) onUpdate();
            }
            catch (error) { console.error("Failed to delete doctor", error); }
        }
    };

    return (
        <>
            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Doctor Profiles</h2>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        <UserPlus size={18} /> Add New Doctor
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <input type="text" name="specialization" value={filters.specialization} onChange={handleFilterChange} placeholder="Filter by specialization..." className="bg-gray-700 px-4 py-2 rounded-md" />
                    <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Filter by location..." className="bg-gray-700 px-4 py-2 rounded-md" />
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-gray-700 px-4 py-2 rounded-md">
                        <option value="">All Statuses</option><option>Available</option><option>Busy</option><option>Off Duty</option>
                    </select>
                </div>
                {isLoading ? <p>Loading Doctors...</p> : (
                    <div className="space-y-4">
                        {doctors.map((doc: any) => (
                            <div key={doc.id} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{doc.name} <span className="text-sm text-gray-400">({doc.gender})</span></p>
                                    <p className="text-sm text-gray-400">{doc.specialization} - {doc.location}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleOpenModal(doc)} className="p-2 text-gray-400 rounded-md hover:bg-blue-500/20 hover:text-blue-400"><Edit size={18} /></button>
                                    <button onClick={() => handleDeleteDoctor(doc.id)} className="p-2 text-gray-400 rounded-md hover:bg-red-500/20 hover:text-red-400"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {isModalOpen && (
                <DoctorFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSaveDoctor} doctor={editingDoctor} />
            )}
        </>
    );
}
