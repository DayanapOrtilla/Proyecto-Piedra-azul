export type UserRole = 'ADMINISTRADOR' | 'AGENDADOR' | 'MEDICO' | 'TERAPISTA' | 'PACIENTE';

export interface User {
  id: string;
  user: string;
  role: UserRole;
  isActive?: boolean;

  firstName?: string;
  lastName?: string;
  email?: string;
  document?: string;
  phone?: string;
  gender?: string;
  birthdate?: string | Date;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  user: User;
}

export interface LoginCredentials {
  user: string;
  password: string;
}

