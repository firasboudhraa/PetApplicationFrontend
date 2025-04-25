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
    roles: [],
    profileImageUrl: '' ,
     bio: ''

  };
  imageTimestamp: number = 0;
  isLoading = true;
  errorMessage = '';
  isAdoptionModalVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.imageTimestamp = new Date().getTime();
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
        console.log('User Data:', data); 
        this.user = { ...data };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.errorMessage = 'Failed to load user profile';
        this.isLoading = false;
      }
    });
  }
  getProfilePictureUrl(): string {
    let url = ''; // Construct the URL as before
    if (!this.user.profileImageUrl) {
        url = '/assets/images/userDefaultPic.png';
    } else if (this.user.profileImageUrl.startsWith('http')) {
        url = this.user.profileImageUrl;
    } else if (this.user.profileImageUrl.startsWith('/api/user/images/')) {
        url = `http://localhost:8081${this.user.profileImageUrl}`;
    } else {
        url = `http://localhost:8081/api/user/images/${this.user.profileImageUrl}`;
    }
    return `${url}?v=${this.imageTimestamp}`;
  }
  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/userDefaultPic.png';
  }
  getRolesAsString(): string {
    if (!this.user.roles) return 'No roles assigned';
    
    if (typeof this.user.roles === 'string') {
      return this.formatRoleName(this.user.roles);
    }
    
    if (Array.isArray(this.user.roles)) {
      return this.user.roles
        .map(role => typeof role === 'string' ? role : role.name)
        .map(role => this.formatRoleName(role))
        .join(', ');
    }
    
    return 'Unknown role format';
    
  }

  private formatRoleName(role: string): string {
    return role.toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearToken();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.authService.clearToken();
        this.router.navigate(['/login']);
      }
    });
  }
  user_pref() {
    this.isAdoptionModalVisible = true;
  }
  editProfile() {
    const tokenData = this.authService.getDecodedToken();
  
    if (tokenData && tokenData.userId === this.user.id) {
      this.router.navigate(['/editProfile', this.user.id]);
    } else {
      this.errorMessage = 'You can only edit your own profile';
    }
  }


  supp(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        console.log('User deleted successfully:', response);
        alert('User deleted successfully'); 
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.errorMessage = 'Failed to delete user'; 
      }
    });
  }
}

