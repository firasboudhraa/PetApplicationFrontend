import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;  // Add `!` here to tell TypeScript it's initialized later.
  errorMessage: string = '';
  successMessage: string = '';
  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';  // To differentiate between success and error modals

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl('PET_OWNER', [Validators.required])
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      this.authService.register(formData).subscribe({
        next: () => {
          this.modalMessage = 'Registration successful! Check your email for activation.';
          this.modalType = 'success';  // Set modal type to success
          this.showModal = true;

          setTimeout(() => {
            this.showModal = false;
          }, 3000);  // Delay to let the user read the success message
        },
        error: (error) => {
          this.modalMessage = error.error?.message || 'Registration failed. Please try again.';
          this.modalType = 'error';  // Set modal type to error
          this.showModal = true;

          setTimeout(() => {
            this.showModal = false;
          }, 2000);
        }
      });
    } else {
      this.modalMessage = 'Please fill out all fields correctly.';
      this.modalType = 'error';  // Set modal type to error
      this.showModal = true;

      setTimeout(() => {
        this.showModal = false;
      }, 2000);
    }
  }
}
