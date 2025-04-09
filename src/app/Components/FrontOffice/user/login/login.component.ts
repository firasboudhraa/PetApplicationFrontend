// login.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service_user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
  });

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
        next: (response: any) => {
          console.log('Login successful', response);
          // Store the token in local storage
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
          // Show success message
          alert('Login successful!');
          // Redirect to profile
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Login failed', err);
          // Show specific error message from server if available
          const errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
          alert(errorMessage);
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}