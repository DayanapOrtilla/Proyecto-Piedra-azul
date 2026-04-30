import { Observable } from 'rxjs';
import type { Professional, Specialty } from '../../models/professional';
import type { CreateProfessionalDto, UpdateProfessionalDto } from '../../services/professionals.service';
import { BaseRepository } from '../base.repository';

export abstract class ProfessionalRepository extends BaseRepository<Professional, CreateProfessionalDto, UpdateProfessionalDto>{
  abstract getProfessionalBySpecialty(specialty: Specialty): Observable<Professional[]>;
}