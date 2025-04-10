// user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../service_user/user.service';
import { User } from '../models/user_model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    roles: []
  };

  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get user ID from token
    const tokenData = this.authService.getDecodedToken();
    
    if (tokenData) {
      const userId = tokenData.userId; 
      this.loadUserProfile(userId);
    } else {
      this.errorMessage = 'User not authenticated';
      this.isLoading = false;
      this.router.navigate(['/login']);
    }
  }

  private loadUserProfile(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (data: User) => {
        this.user = { ...data }; // Merge user data with API response
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.errorMessage = 'Failed to load user profile';
        this.isLoading = false;
      }
    });
  }

  getRolesAsString(): string {
    return this.user.roles
      .map(role => this.formatRoleName(role.name))
      .join(', ');
  }

  private formatRoleName(role: string): string {
    return role.toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.authService.clearToken(); // Force clear token if logout failed
        this.router.navigate(['/home']);
      }
    });
  }
}
