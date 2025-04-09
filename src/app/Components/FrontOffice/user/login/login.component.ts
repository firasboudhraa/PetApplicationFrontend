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
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
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
        next: () => {
          alert('Login successful!');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
          alert(errorMessage);
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}