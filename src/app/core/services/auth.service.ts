import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import type { AuthResponse, User, UserRole } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Gender } from '../models/patient';

const TOKEN_KEY = 'pa_token';
const USER_KEY  = 'pa_user';

const KEYCLOAK_URL    = 'http://localhost:8080';
const KEYCLOAK_REALM  = 'piedrazul';
const KEYCLOAK_CLIENT = 'piedrazul-app';

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

export interface LoginCredentials {
  user: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http       = inject(HttpClient);
  private router     = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private _user = signal<User | null>(this._loadUserFromStorage());

  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn  = computed(() => this._user() !== null);
  readonly userRole    = computed(() => this._user()?.role ?? null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._user.set(this._loadUserFromStorage());
    }
  }

async login(credentials: LoginCredentials): Promise<void> {
  const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const body = new URLSearchParams();
  body.set('client_id', KEYCLOAK_CLIENT);
  body.set('grant_type', 'password');
  body.set('username', credentials.user);
  body.set('password', credentials.password);

  try {
    const response = await firstValueFrom(
      this.http.post<any>(tokenUrl, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      })
    );

    const accessToken = response.access_token;

    const payload = this._decodeToken(accessToken);
    const roles: string[] = payload?.realm_access?.roles ?? [];
    const appRole = roles.find((r: string) =>
      ['ADMINISTRADOR', 'AGENDADOR', 'MEDICO', 'TERAPISTA', 'PACIENTE'].includes(r)
    ) ?? 'PACIENTE';

    const user: User = {
  id:        payload.sub,
  user:      payload.preferred_username,
  firstName: payload.given_name,
  lastName:  payload.family_name,
  role:      appRole as UserRole,
  isActive:  true,
};

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    this._user.set(user);
    return Promise.resolve();

  } catch (error: any) {
    console.error('Login Keycloak Error:', error);
    return Promise.reject(new Error('Usuario o contraseña incorrectos'));
  }
}

  async register(dto: RegisterPatientDto): Promise<void> {
    await firstValueFrom(
      this.http.post<any>(`${environment.apiUrl}/auth/register`, dto)
    );
    await this.login({ user: dto.document, password: dto.password });
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
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this.userRole();
    return role !== null && roles.includes(role);
  }

  private _decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return {};
    }
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

