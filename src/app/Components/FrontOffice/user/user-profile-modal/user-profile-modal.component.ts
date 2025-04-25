import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Import necessary modules
import { UserService } from '../service_user/user.service';  // Import UserService

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.css']
})
export class UserProfileModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() userId: number = 0; // Input property to accept userId
  @Output() closeModal = new EventEmitter<void>();

  prefrencesForm!: FormGroup;  // Use the '!' to assert it will be initialized
  preferences: any;  // Store user preferences
  isLoading = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,  // FormBuilder for easy form creation
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.prefrencesForm = this.fb.group({
      lifestyle: ['', Validators.required],
      experience: ['', Validators.required],
      livingSpace: ['', Validators.required],
      preferences: ['', Validators.required]
    });

    if (this.userId > 0) {
      this.loadUserPreferences(this.userId);
    }
  }

  private loadUserPreferences(userId: number): void {
    this.userService.getAdoptionPreferences(userId).subscribe({
      next: (data) => {
        this.preferences = data;
        this.isLoading = false;
        this.prefrencesForm.patchValue(data); 
      },
      error: (err) => {
        console.error('Failed to load preferences:', err);
        this.errorMessage = 'Failed to load user preferences';
        this.isLoading = false;
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-background')) {
      this.close();
    }
  }

  close(): void {
    this.closeModal.emit();
  }

onSubmit(): void {
  if (this.prefrencesForm.valid) {
    this.isLoading = true;
    const preferencesData = {
      id: this.userId ,
      lifestyle: this.prefrencesForm.value.lifestyle,
      experience: this.prefrencesForm.value.experience,
      living_space: this.prefrencesForm.value.livingSpace,
      preferences: this.prefrencesForm.value.preferences,
          };
    
    this.userService.updateAdoptionPreferences(this.userId, preferencesData)
      .subscribe({
        next: (response) => {
          console.log('Preferences updated successfully:', response);
          console.log('Preferences Submitted:', this.prefrencesForm.value);

          this.isLoading = false;
          this.close(); // Close the modal after successful submission
        },
        error: (err) => {
          console.error('Failed to update preferences:', err);
          this.errorMessage = 'Failed to update preferences';
          this.isLoading = false;
        }
      });
  } else {
    console.error('Form is invalid');
    Object.values(this.prefrencesForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
}
