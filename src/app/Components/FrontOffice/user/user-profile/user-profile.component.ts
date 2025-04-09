import { Component } from '@angular/core';
import { AuthService } from '../service_user/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  logout() {
    // Get the token from storage
    const token = this.authService.getToken();
    
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Prepare headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Call the logout endpoint
    this.http.post('/auth/logout', {}, { headers }).subscribe({
      next: () => {
        // Clear local storage and redirect on success
        this.authService.clearToken();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // Even if backend logout fails, clear local token and redirect
        this.authService.clearToken();
        this.router.navigate(['/home']);
      }
    });
  }
}