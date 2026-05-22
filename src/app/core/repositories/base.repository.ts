import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

// Contrato genérico que todo repositorio debe cumplir
// T = tipo de entidad, C = DTO de creación, U = DTO de actualización
export abstract class BaseRepository<T, C, U> {
  protected http = inject(HttpClient);
  protected abstract url: string;
  abstract findAll(): Observable<T[]>;
  abstract findById(id: string): Observable<T | undefined>;
  abstract save(dto: C): Observable<T>;
  abstract update(id: string, dto: U): Observable<T>;
  abstract delete(id: string): Observable<Boolean>;
}