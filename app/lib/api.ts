import axios from 'axios';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) { 
      config.headers.Authorization = `Bearer ${token}`; 
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      alert('Your session has expired. Please log in again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);
export const getQueue = () => api.get('/queue');
export const addPatientToQueue = (data: any) => api.post('/queue', data);
export const updatePatientInQueue = (id: number, data: any) => api.patch(`/queue/${id}`, data);
export const removePatientFromQueue = (id: number) => api.delete(`/queue/${id}`);
export const getDoctors = (params: any) => api.get('/doctors', { params });
export const addDoctor = (data: any) => api.post('/doctors', data);
export const updateDoctor = (id: number, data: any) => api.patch(`/doctors/${id}`, data);
export const deleteDoctor = (id: number) => api.delete(`/doctors/${id}`);
export const getAppointments = (params: any) => api.get('/appointments', { params });
export const getAppointmentsByDoctor = (doctorId: number) => api.get(`/appointments/doctor/${doctorId}`);
export const createAppointment = (data: any) => api.post('/appointments', data);
export const updateAppointment = (id: number, data: any) => api.patch(`/appointments/${id}`, data);
export const deleteAppointment = (id: number) => api.delete(`/appointments/${id}`);
