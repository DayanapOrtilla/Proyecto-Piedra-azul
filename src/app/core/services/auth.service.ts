import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import type { User, UserRole, LoginCredentials } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Gender } from '../models/patient';

const TOKEN_KEY = 'pa_token';
const USER_KEY  = 'pa_user';

export interface RegisterPatientDto {
  document: string;
  firstName: string;
  lastName: string;
  birthdate?: Date;
  phone: string;
  gender: Gender;
  email?: string;
  password: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private _user = signal<User | null>(this._loadUserFromStorage());


  // Señales públicas de solo lectura
  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn  = computed(() => this._user() !== null);
  readonly userRole    = computed(() => this._user()?.role ?? null);

  constructor() {
    if(isPlatformBrowser(this.platformId)){
      this._user.set(this._loadUserFromStorage());
    }
  }

  async register(dto: RegisterPatientDto) {
    const response = await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/auth/register`, dto));

    const credentials = {
      user: dto.document,
      password: dto.password
    } as LoginCredentials;
    await this.login(credentials);
  }

  /**
   * Login. 
   */
  async login(credentials: LoginCredentials): Promise<void> {
    // 1. Preparamos el cuerpo con 'user' (que es el documento/id en el backend)
    const loginData = {
      user: credentials.user,
      password: credentials.password
    };

    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${environment.apiUrl}/auth/login`, loginData)
      );

      const { token, user } = response;

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      
      this._user.set(user);

      return Promise.resolve();
    } catch (error: any) {
      console.error('Login Error:', error);
      return Promise.reject(new Error(error.error?.message || 'Error de conexión con el servidor'));
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null;
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this.userRole();
    return role !== null && roles.includes(role);
  }

  private _loadUserFromStorage(): User | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}