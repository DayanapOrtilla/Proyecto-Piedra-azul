import { Observable }   from 'rxjs';
import type { Patient } from '../../models/patient';
import type { CreatePatientDto, UpdatePatientDto } from '../../services/patients.service';
import { BaseRepository } from '../base.repository';
import { UpdateAvailabilityDto } from '../../services/availabilities.service';

export abstract class PatientRepository extends BaseRepository<Patient, CreatePatientDto, UpdatePatientDto>{
  abstract search(term: string): Observable<Patient[]>;
  abstract deactivate(id: string): Observable<Patient>;
  abstract findByUser(user: string): Observable<Patient | undefined>;
}