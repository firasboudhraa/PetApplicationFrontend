import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-activate-account',
  template: `
    <div *ngIf="success">Account activated! You can now <a routerLink="/login">login</a>.</div>
    <div *ngIf="error">{{ error }}</div>
  `
})
export class ActivateAccountComponent implements OnInit {
  success = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.activateAccount(token).subscribe({
        next: () => this.success = true,
        error: (err) => this.error = err.message
      });
    } else {
      this.error = 'No activation token provided.';
    }
  }
}