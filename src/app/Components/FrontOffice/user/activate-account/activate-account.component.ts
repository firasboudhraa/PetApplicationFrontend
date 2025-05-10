import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  activationCode: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  countdown = 3;
  private countdownInterval: any;
  showActivationButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Clear any existing tokens when visiting the activation page
    this.authService.clearToken();
    localStorage.removeItem('user');
    
    // Get the code from URL parameters but don't activate automatically
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.activationCode = params['code'];
        this.showActivationButton = true;
        console.log('Activation code from URL:', this.activationCode);
      }
    });
  }

  onConfirmCode(): void {
    if (!this.validateCode()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Sending activation code:', this.activationCode);

    this.authService.activateAccount(this.activationCode).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Account activated successfully! Redirecting to login...';
          this.startCountdown();
        } else {
          this.errorMessage = response.message || 'Activation failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid or expired activation code';
        console.error('Activation error:', error);
      }
    });
  }

  private validateCode(): boolean {
    if (!this.activationCode || this.activationCode.length !== 6) {
      this.errorMessage = 'Please enter a complete 6-digit code';
      return false;
    }
    return true;
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.router.navigate(['/login'], { queryParams: { activated: true } });
      }
    }, 1000);
  }

  onResendCode(): void {
    const email = this.authService.getPendingEmail();
    if (!email) {
      this.errorMessage = 'No email address found for resending';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resendVerificationCode(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'New activation code sent to your email';
        } else {
          this.errorMessage = response.message || 'Failed to resend code';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to resend code';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}