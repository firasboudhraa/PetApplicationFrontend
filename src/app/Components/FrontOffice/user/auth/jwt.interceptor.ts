// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip token for specific endpoints only
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

    return next.handle(authReq);
  }

}