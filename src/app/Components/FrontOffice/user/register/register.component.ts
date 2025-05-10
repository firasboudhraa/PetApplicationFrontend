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

  registerForm!: FormGroup;  
  errorMessage: string = '';
  successMessage: string = '';
  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';  

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]|;:"<>,.?/~`]).{8,}$')
      ])
,            role: new FormControl('ADMIN', [Validators.required])
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      this.authService.register(formData).subscribe({
        next: () => {
          this.modalMessage = 'Registration successful! Check your email for activation.';
          this.modalType = 'success'; 
          this.showModal = true;

          setTimeout(() => {
            this.showModal = false;
          }, 3000);  
        },
        error: (error) => {
          this.modalMessage = error.error?.message || 'Registration failed. Please try again.';
          this.modalType = 'error'; 
          this.showModal = true;

          setTimeout(() => {
            this.showModal = false;
          }, 2000);
        }
      });
    } else {
      this.modalMessage = 'Please fill out all fields correctly.';
      this.modalType = 'error'; 
      this.showModal = true;

      setTimeout(() => {
        this.showModal = false;
      }, 2000);
    }
  }
}
