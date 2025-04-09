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
  private apiUrl = 'http://localhost:8081/auth'; // without /logout

  logout() {
    const token = this.authService.getToken();
    
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Use full URL to ensure correct endpoint
    const logoutUrl = `${this.apiUrl}/logout`;
    
    // Include both the auth token and cache-control headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    this.http.post(logoutUrl, {}, { headers }).subscribe({
      next: () => {
        this.authService.clearToken();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.authService.clearToken();
        this.router.navigate(['/home']);
      }
    });
  }
}