// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  success: boolean;
  message: string;
}

interface DecodedToken {
  sub: string;        // Email
  roles: string[];    // Array of roles and permissions
  userId: number;     // User ID
  iat: number;        // Issued at
  exp: number;        // Expiration
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) { }


  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    this.clearToken();
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email: email });
  }

// auth.service.ts
resetPassword(token: string, newPassword: string): Observable<any> {
  // Ensure we're only sending the token value, not the full URL
  const cleanToken = this.extractTokenFromUrl(token);
  return this.http.post(`${this.apiUrl}/reset-password`, { 
    token: cleanToken, 
    newPassword 
  });
}

private extractTokenFromUrl(token: string): string {
  if (token.includes('token=')) {
    try {
      const url = new URL(token);
      return url.searchParams.get('token') || token;
    } catch {
      return token;
    }
  }
  return token;
}
  register(userData: RegisterRequest): Observable<any> {
    this.setPendingEmail(userData.email);
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  
  resendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-code`, { email });
  }
    

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    return token ? jwtDecode<DecodedToken>(token) : null;
  }

  getCurrentUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub || null;
  }

  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.roles || [];
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  activateAccount(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/activate`, { code });
  }
private pendingEmailKey = 'pending_email';

setPendingEmail(email: string): void {
  localStorage.setItem(this.pendingEmailKey, email);
}

getPendingEmail(): string | null {
  return localStorage.getItem(this.pendingEmailKey);
}

clearPendingEmail(): void {
  localStorage.removeItem(this.pendingEmailKey);
}


}