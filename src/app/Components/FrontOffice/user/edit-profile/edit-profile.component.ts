import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../service_user/user.service';
import { User } from '../models/user_model';
import { ToastrService } from 'ngx-toastr'; 

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
    roles: [],
    bio: '' 
  };
  
  // Add these new properties
  availableRoles: string[] = ['PET_OWNER', 'VETERINARIAN', "SERVICE_PROVIDER"]; 
  selectedRole: string = '';
  password: string = '';
  
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  selectedFile?: File;
  previewUrl: string | ArrayBuffer | null = null;
  
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService 
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

  updateProfile(): void {
    const formData = new FormData();
    console.log('Bio value before submit:', this.user.bio);

  
    // Append the user data as a JSON string
     formData.append('user', JSON.stringify({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: this.password,
      bio: this.user.bio, 
      selectedFile: this.selectedFile,
    }));
  
    // Append the profile image if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Assuming backend expects 'image'
    }
  
    // Now make the update request with the correct formData
    this.userService.updateUserWithImage(formData, this.user.id).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to update profile');
      }
    });
  }
  
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
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