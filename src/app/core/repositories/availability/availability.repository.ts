import { Observable } from 'rxjs';
import type { Availability } from '../../models/availability';
import type { CreateAvailabilityDto, UpdateAvailabilityDto } from '../../services/availabilities.service';
import { BaseRepository } from '../base.repository';

export abstract class AvailabilityRepository extends BaseRepository<Availability, CreateAvailabilityDto, UpdateAvailabilityDto> {
  abstract deactivate(id: string): Observable<Availability>;
  abstract findByProfessional(id: string): Observable<Availability[]>;
  abstract saveAll(professionalId: string, availability: Availability[]): Observable<Availability[]>;
}