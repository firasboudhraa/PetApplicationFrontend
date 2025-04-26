import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface UserPayload {
  roles: string[];
  userId: number;
  sub: string;
  iat?: number;
  exp?: number;
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