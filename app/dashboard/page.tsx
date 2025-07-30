"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { QueueList } from '../components/QueueList';
import { DoctorManager } from '../components/DoctorManager';
import { AppointmentManager } from '../components/AppointmentManager';
import { AvailableDoctors } from '../components/AvailableDoctors';
export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); }
  }, [router]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  }
  const renderContent = () => {
    if (activeTab === 'dashboard') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <QueueList key={`queue-${refreshKey}`} onUpdate={triggerRefresh} />
                </div>
                <div className="space-y-8">
                     <AvailableDoctors key={`doctors-${refreshKey}`} onUpdate={triggerRefresh} />
                </div>
            </div>
        );
    }
    if (activeTab === 'appointments') {
        return <AppointmentManager key={`appoints-${refreshKey}`} onUpdate={triggerRefresh} />;
    }
    if (activeTab === 'manage-doctors') {
        return <DoctorManager key={`doc-manager-${refreshKey}`} onUpdate={triggerRefresh} />;
    }
    return null;
  };
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Front Desk Dashboard</h1>
        <div className="flex items-center gap-2">
            <div className="bg-gray-800 p-1 rounded-lg flex items-center gap-1">
                <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Dashboard</button>
                <button onClick={() => setActiveTab('appointments')} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>All Appointments</button>
                <button onClick={() => setActiveTab('manage-doctors')} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${activeTab === 'manage-doctors' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Manage Doctors</button>
            </div>
            <button onClick={handleLogout} className="flex items-center p-2 font-semibold text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700">
                <LogOut size={20} />
            </button>
        </div>
      </header>
      <main>{renderContent()}</main>
    </div>
  );
}
