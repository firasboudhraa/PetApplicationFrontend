// login.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
  });

  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';  // Default to success
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  save() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.modalMessage = 'Login successful!';
          this.modalType = 'success';  // Success modal type
          this.showModal = true;

          setTimeout(() => {
            this.showModal = false;
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (err) => {
          this.modalMessage = err.error?.message || 'Login failed. Please check your credentials.';
          this.modalType = 'error';  // Error modal type
          this.showModal = true;

          setTimeout(() => {
            this.showModal = false;
          }, 2000);
        }
      });
    } else {
      this.modalMessage = 'Please fill in all required fields correctly.';
      this.modalType = 'error';  // Error modal type for invalid form
      this.showModal = true;

      setTimeout(() => {
        this.showModal = false;
      }, 2000);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
