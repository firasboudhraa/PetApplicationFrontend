import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface Role {
  roleId: number;
  name: string; // RoleEnum: 'USER' | 'ADMIN' | etc.
  permissions: string[]; // e.g., ['ADMIN_READ', 'ADMIN_UPDATE']
}

export interface UserPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  enabled: boolean;
  accountLocked: boolean;
  exp?: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserFromToken(): UserPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<UserPayload>(token);
      return decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
