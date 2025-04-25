import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token = '';
  isLoading = false;
  message = '';
  error = '';
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      const fullToken = params['token'] || '';
      if (fullToken.includes('token=')) {
        const url = new URL(fullToken);
        this.token = url.searchParams.get('token') || '';
      } else {
        this.token = fullToken;
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  get password() { return this.resetForm.get('newPassword'); }
  get confirm() { return this.resetForm.get('confirmPassword'); }

  onSubmit() {
    if (!this.token) {
      this.error = 'Invalid reset link. Please request a new password reset.';
      return;
    }

    if (this.resetForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.message = '';

    this.authService.resetPassword(
      this.token, 
      this.resetForm.value.newPassword
    ).subscribe({
      next: (response: any) => {
        this.message = response.message || 'Password reset successfully!';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 
                   (err.status === 400 ? 'Invalid or expired token' : 'Error resetting password');
        this.isLoading = false;
      }
    });
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }
  
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}