// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl =  'http://localhost:8081'; // Update with your gateway/base URL


  constructor(private http: HttpClient) { }

  register(userData: RegisterRequest): Observable<any> {
    // Transform role to uppercase if needed
    const payload = {
        ...userData,
        role: userData.role.toUpperCase().replace(' ', '_')
    };
    return this.http.post(`${this.apiUrl}/auth/register`, payload);
}

// In your Angular auth service
login(credentials: any): Observable<any> {
  return this.http.post('/auth/login', credentials).pipe(
    tap((response: any) => {
      // Store in sessionStorage instead of localStorage
      sessionStorage.setItem('token', response.token);
    })
  );
}

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}