import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user_model';
import { Router } from '@angular/router';
import { UserService } from '../service_user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    user: User = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
      profileImageUrl: '',
      bio: ''
    };
    
    // Modal properties
    showModal = false;
    modalMessage = '';
    modalType: 'success' | 'error' | 'warning' = 'success';
    modalTitle = '';
    isDeleteModalVisible = false;
    
    imageTimestamp: number = 0;
    isLoading = true;
    errorMessage = '';
    isAdoptionModalVisible = false;
    
    isProfilePicModalVisible = false;
selectedFile?: File;
previewUrl: string | ArrayBuffer | null = null;

    
    constructor(
      private authService: AuthService,
      private router: Router,
      private userService: UserService
    ) {}
  
    ngOnInit(): void {
      this.imageTimestamp = new Date().getTime();
      const tokenData = this.authService.getDecodedToken();
      
      if (tokenData && tokenData.userId) {
        this.loadUserProfile(tokenData.userId);
      } else {
        this.showAlert('error', 'Authentication Required', 'Please login to access your profile');
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    }
  
    private loadUserProfile(userId: number): void {
      this.userService.getUserById(userId).subscribe({
        next: (data: User) => {
          this.user = { ...data };
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load profile:', err);
          this.errorMessage = 'Failed to load user profile';
          this.showAlert('error', 'Loading Failed', 'Failed to load user profile');
          this.isLoading = false;
        }
      });
    }
    
    getProfilePictureUrl(): string {
      let url = '';
      
      if (!this.user.profileImageUrl) {
          url = '/assets/images/userDefaultPic.png';
      } else if (this.user.profileImageUrl.startsWith('http')) {
          url = this.user.profileImageUrl;
      } else if (this.user.profileImageUrl.startsWith('/api/user/images/')) {
          url = `http://localhost:8084${this.user.profileImageUrl}`;
      } else {
          url = `http://localhost:8084/api/user/images/${this.user.profileImageUrl}`;
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
      if (!role) return 'Unknown';
      
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
          // Still clear token and redirect even if the backend call fails
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
        this.showAlert('error', 'Permission Denied', 'You can only edit your own profile');
      }
    }
  
    showAlert(type: 'success' | 'error' | 'warning', title: string, message: string): void {
      this.modalType = type;
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
      
      // Auto-hide after 3 seconds for success messages
      if (type === 'success') {
        setTimeout(() => {
          this.showModal = false;
        }, 3000);
      }
    }
  
    closeModal(): void {
      this.showModal = false;
    }
  
    supp(id: number): void {
      this.isDeleteModalVisible = true;
    }
  
    confirmDelete(confirm: boolean): void {
      this.isDeleteModalVisible = false;
      
      if (confirm) {
        this.userService.softDeleteUser(this.user.id).subscribe({
          next: () => {
            this.showAlert('success', 'Account Deleted', 'Your account has been deleted successfully');
            this.authService.logout().subscribe({
              next: () => {
                this.authService.clearToken();
                this.router.navigate(['/login']);
              },
              error: (err) => {
                this.authService.clearToken();
                this.router.navigate(['/login']);
              }
            });
          },
          error: (err) => {
            console.error('Account deletion failed:', err);
            this.showAlert('error', 'Deletion Failed', 'Failed to delete account. Please try again.');
          }
        });
      }
    }

    openProfilePicModal(): void {
      this.isProfilePicModalVisible = true;
      this.previewUrl = null; // Reset preview when opening modal
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
    
    updateProfilePicture(): void {
      if (!this.selectedFile) {
        this.showAlert('warning', 'No Image Selected', 'Please select an image first');
        return;
      }
    
      const formData = new FormData();
      formData.append('image', this.selectedFile);
    
      this.userService.updateUserProfileImage(formData, this.user.id).subscribe({
        next: () => {
          // Update the timestamp to force image refresh
          this.imageTimestamp = new Date().getTime();
          this.showAlert('success', 'Success', 'Profile picture updated successfully');
          this.isProfilePicModalVisible = false;
          this.previewUrl = null;
          this.selectedFile = undefined;
          
          // Refresh user data to get updated profile URL
          this.loadUserProfile(this.user.id);
        },
        error: (error) => {
          console.error('Error updating profile picture:', error);
          this.showAlert('error', 'Update Failed', 'Failed to update profile picture');
        }
      });
    }
  
}