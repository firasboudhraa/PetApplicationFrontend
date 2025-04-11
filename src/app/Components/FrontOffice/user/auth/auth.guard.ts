// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    // Check if the user has the required role admin
     const requiresAdmin = route.data['adminOnly'] || false;
    if (requiresAdmin && !this.authService.isAdmin()) {
      alert('Access Denied');
      return false;
    }
  
    return true;
  }
  
}