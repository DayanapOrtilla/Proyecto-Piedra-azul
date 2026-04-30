import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams }          from '@angular/common/http';
import { Observable }          from 'rxjs';
import { AppointmentRepository } from './appointment.repository';
import type { Appointment }      from '../../models/appointment';
import { environment }           from '../../../../environments/environment';
import { CreateAppointmentDTO, UpdateAppointmentDTO } from '../../services/appointments.service';

@Injectable()
export class HttpAppointmentRepository extends AppointmentRepository {
  protected url  = `${environment.apiUrl}/appointments`;

  findAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.url);  
  }

  findByProfessional(professionalId?: string, date?: string): Observable<Appointment[]> {
    const params: string[] = [];
    if (professionalId) params.push(`professionalId=${professionalId}`);
    if (date)           params.push(`date=${date}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return this.http.get<Appointment[]>(`${this.url}${query}`);
  }

  findByPatient(patientId: string, date?: string): Observable<Appointment[]> {
      const params: string[] = [];
    if (patientId) params.push(`professionalId=${patientId}`);
    if (date)           params.push(`date=${date}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return this.http.get<Appointment[]>(`${this.url}${query}`);
  }

  save(booking: CreateAppointmentDTO): Observable<Appointment> {
    return this.http.post<Appointment>(this.url, booking);
  }

  getHistory(patientId?: string, professionalId?: string, date?: string): Observable<Appointment[]> {
  let params = new HttpParams();

  if (professionalId) {
    params = params.set('professionalId', professionalId);
  }
  if (date) {
    params = params.set('date', date);
  }
  return this.http.get<Appointment[]>(`${this.url}`, { params });
}

  findById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.url}/${id}`);
  }

  update(id: string, dto: UpdateAppointmentDTO): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.url}/${id}`, dto);
  }

  delete(id: string): Observable<Boolean> {
    return this.http.delete<Boolean>(`${this.url}/${id}`);
  }
}