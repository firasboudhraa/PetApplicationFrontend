// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const skipAuth = [
      '/api/auth/login', 
      '/api/auth/register',
      '/api/auth/activate'
    ].some(url => request.url.includes(url));

    if (skipAuth) {
      return next.handle(request);
    }

    const token = this.authService.getToken();
    if (!token) {
      return next.handle(request);
    }

    const authReq = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    // Add error handling to handle 401 responses
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Clear invalid token and redirect to login
          this.authService.clearToken();
          localStorage.removeItem('user');
        }
        return throwError(() => error);
      })
    );
  }
}