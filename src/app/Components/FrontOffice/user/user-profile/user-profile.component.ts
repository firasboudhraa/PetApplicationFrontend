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
    roles: [],  // Role is a single string based on your registration JSON
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
    if (!this.user.roles) return 'No roles assigned';
    
    // Handle string case
    if (typeof this.user.roles === 'string') {
      return this.formatRoleName(this.user.roles);
    }
    
    // Handle array case
    if (Array.isArray(this.user.roles)) {
      // Handle both Role objects and strings
      return this.user.roles
        .map(role => typeof role === 'string' ? role : role.name)
        .map(role => this.formatRoleName(role))
        .join(', ');
    }
    
    return 'Unknown role format';
  }

private formatRoleName(role: string): string {
    return role.toLowerCase()
        .replace(/_/g, ' ')  // Replace underscores with spaces
        .replace(/\b\w/g, (l) => l.toUpperCase());  // Capitalize each word
}


  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearToken();  // Ensure token is cleared
        this.router.navigate(['/login']);  // Redirect user to login page after logout
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.authService.clearToken();  // Force clear token if logout failed
        this.router.navigate(['/login']);  // Redirect on error as well
      }
    });
  }

  // Edit profile if the logged-in user is the same as the profile user
  editProfile() {
    const tokenData = this.authService.getDecodedToken();
    console.log('Token:', tokenData, 'User:', this.user); // Debug log
  
    if (tokenData && tokenData.userId === this.user.id) {
      this.router.navigate(['/editProfile', this.user.id]);
    } else {
      this.errorMessage = 'You can only edit your own profile';
    }
  }
  
}
