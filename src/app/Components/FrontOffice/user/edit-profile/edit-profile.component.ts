import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../service_user/user.service';
import { User } from '../models/user_model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  user: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    roles: []
  };
  
  // Add these new properties
  availableRoles: string[] = ['PET_OWNER', 'VETERINARIAN', "SERVICE_PROVIDER"]; 
  selectedRole: string = '';
  password: string = '';
  
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    const tokenData = this.authService.getDecodedToken();
    
    if (tokenData && tokenData.userId === userId) {
      this.loadUserProfile(userId);
    } else {
      this.errorMessage = 'You are not authorized to edit this profile';
      this.isLoading = false;
      this.router.navigate(['/profile']);
    }
  }

  private loadUserProfile(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (data: User) => {
        this.user = { ...data };
        // Initialize selectedRole with current role
        this.selectedRole = typeof this.user.roles === 'string' 
          ? this.user.roles 
          : this.user.roles[0]?.name || '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.errorMessage = 'Failed to load user profile';
        this.isLoading = false;
      }
    });
  }

  // Updated updateProfile method
  updateProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      role: this.selectedRole
    };

   
    this.userService.updateUser(updateData, this.user.id).subscribe({
      next: (updatedUser: User) => {
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.errorMessage = err.error?.message || 'Failed to update profile';
        this.isLoading = false;
      }
    });
  }

  getRolesAsString(): string {
    if (!this.user.roles || this.user.roles.length === 0) return 'No roles assigned';
    
    // Handle array case, both objects and strings
    return this.user.roles
      .map(role => typeof role === 'string' ? role : role.name)
      .map(role => this.formatRoleName(role))
      .join(', ');
  }
  
  private formatRoleName(role: string): string {
    return role.toLowerCase()
      .replace(/_/g, ' ')  // Replace underscores with spaces
      .replace(/\b\w/g, (l) => l.toUpperCase());  // Capitalize each word
  }
}