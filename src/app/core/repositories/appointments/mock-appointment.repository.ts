import { Injectable }      from '@angular/core';
import { Observable, of }  from 'rxjs';
import { AppointmentRepository } from './appointment.repository';
import type { Appointment }      from '../../models/appointment';
import type { CreateAppointmentDTO, UpdateAppointmentDTO }     from '../../services/appointments.service';

@Injectable()
export class MockAppointmentRepository extends AppointmentRepository {

  private data: Appointment[] = [
    { id: 'a1', date: '2026-03-15', time: '08:00', status: 'CONFIRMADA',
      patient:      { id: 'pa1', firstName: 'Juan',   lastName: 'García',    phone: '3001234567' },
      professional: { id: 'p1',  firstName: 'Carlos', lastName: 'Rodríguez', specialty: 'QUIROPRAXIA',    type: 'MEDICO'    , intervalMinutes:30  , isActive: true}},
    { id: 'a2', date: '2026-03-15', time: '09:00', status: 'PENDIENTE',
      patient:      { id: 'pa2', firstName: 'María',  lastName: 'López',     phone: '3109876543' },
      professional: { id: 'p2',  firstName: 'Ana',    lastName: 'Martínez',  specialty: 'FISIOTERAPIA',   type: 'TERAPISTA' , intervalMinutes:45  , isActive: true}},
    { id: 'a3', date: '2026-03-15', time: '10:00', status: 'COMPLETADA',
      patient:      { id: 'pa3', firstName: 'Pedro',  lastName: 'Suárez',    phone: '3201122334' },
      professional: { id: 'p3',  firstName: 'Luis',   lastName: 'Gómez',     specialty: 'TERAPIA_NEURAL', type: 'TERAPISTA' , intervalMinutes:60  , isActive: true}},
    { id: 'a4', date: '2026-03-15', time: '11:00', status: 'CANCELADA',
      patient:      { id: 'pa1', firstName: 'Juan',   lastName: 'García',    phone: '3001234567' },
      professional: { id: 'p1',  firstName: 'Carlos', lastName: 'Rodríguez', specialty: 'QUIROPRAXIA',    type: 'MEDICO'    , intervalMinutes:30  , isActive: true}},
  ];

  protected url: string ="";

  findAll(): Observable<Appointment[]> {
    return of(this.data);
  }

  findById(id: string): Observable<Appointment | undefined> {
    return of(this.data.find(p => p.id === id));
  }

  findByProfessional(professionalId?: string, date?: string): Observable<Appointment[]> {
    return of(this.data.filter(a => {
      const byProf = !professionalId || a.professional.id === professionalId;
      const byDate = !date           || a.date === date;
      return byProf && byDate;
    }));
  }

  findByPatient(patientId?: string, date?: string): Observable<Appointment[]> {
    return of(this.data.filter(a => {
      const byProf = !patientId || a.patient.id === patientId;
      const byDate = !date           || a.date === date;
      return byProf && byDate;
    }));
  }


  getHistory(patientId?: string, professionalId?: string, date?: string): Observable<Appointment[]> {
    return of(this.data.filter(p => p.professional.id !== professionalId));
  }
  getMyAppointments(): Observable<Appointment[]> {
  return of(this.data);
}

  save(booking: CreateAppointmentDTO): Observable<Appointment> {
    const newAppointment: Appointment = {
      id:        crypto.randomUUID(),
      date:      booking.date!,
      time: booking.time!,
      status:    'PENDIENTE',
      patient: {
        id:        booking.patient!.id,
        firstName: booking.patient!.firstName,
        lastName:  booking.patient!.lastName,
        phone:     booking.patient!.phone,
      },
      professional: {
        id:        booking.professional!.id,
        firstName: booking.professional!.firstName,
        lastName:  booking.professional!.lastName,
        specialty: booking.professional!.specialty,
        type:      booking.professional!.type,
        intervalMinutes: booking.professional!.intervalMinutes,
        isActive: booking.professional.isActive
      },
    };
    this.data.push(newAppointment);
    return of(newAppointment);
  }

  update(id: string, dto: UpdateAppointmentDTO): Observable<Appointment> {
    const index = this.data.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Cita no encontrada');
    this.data[index] = { ...this.data[index], ...dto };
    return of(this.data[index]);
  }

  delete(id: string): Observable<Boolean> {
    const index = this.data.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Cita no encontrada');
    this.data.slice(index, 1);
    return of(true);
  }
  reschedule(id: string, newDate: string, newTime: string, reason?: string): Observable<Appointment> {
  const index = this.data.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Cita no encontrada');
  this.data[index] = { ...this.data[index], date: newDate, time: newTime };
  return of(this.data[index]);
}
}