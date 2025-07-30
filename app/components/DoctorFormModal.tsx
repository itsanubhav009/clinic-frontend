"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    doctor: any | null;
}
export function DoctorFormModal({ isOpen, onClose, onSubmit, doctor }: ModalProps) {
    const [formData, setFormData] = useState({
        name: '', specialization: '', gender: 'Male', location: '',
        status: 'Available', nextAvailable: ''
    });
    useEffect(() => {
        if (doctor) { setFormData(doctor); }
        else {
             setFormData({ name: '', specialization: '', gender: 'Male', location: '', status: 'Available', nextAvailable: '' });
        }
    }, [doctor]);
    if (!isOpen) return null;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6">{doctor ? 'Edit Doctor Profile' : 'Add New Doctor'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required />
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required />
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required>
                        <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location (e.g., Room 101)" className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required />
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required>
                        <option>Available</option><option>Busy</option><option>Off Duty</option>
                    </select>
                    <input type="text" name="nextAvailable" value={formData.nextAvailable} onChange={handleChange} placeholder="Next Available (e.g., Now, 2:30 PM)" className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" required />
                    <div className="pt-4">
                        <button type="submit" className="w-full py-2.5 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Doctor</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
