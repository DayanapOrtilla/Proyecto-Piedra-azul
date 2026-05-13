import { Observable }      from 'rxjs';
import type { Appointment } from '../../models/appointment';
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from '../../services/appointments.service';
import { BaseRepository } from '../base.repository';

export abstract class AppointmentRepository extends BaseRepository<Appointment, CreateAppointmentDTO, UpdateAppointmentDTO> {
  abstract findByProfessional(professionalId: string, date?: string): Observable<Appointment[]>;
  abstract findByPatient(patientId: string, date?: string): Observable<Appointment[]>;
  abstract getHistory(patientId?: string, professionalId?: string, date?: string): Observable<Appointment[]>
  abstract getMyAppointments(): Observable<Appointment[]>;
}