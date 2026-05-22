import type { Patient } from './patient'; 
import type { Professional } from './professional';

export type AppointmentStatus = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA' | 'NO_ASISTE'; 

export interface Appointment { 
    id: string; 
    date: string; // "2026-03-20" 
    time: string; // "09:00" 
    status: AppointmentStatus; notes?: string; 
    patient: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'phone'>; 
    professional: Pick<Professional, 'id' | 'firstName' | 'lastName' | 'specialty' | 'type' | 'intervalMinutes' | 'isActive'>; 
}