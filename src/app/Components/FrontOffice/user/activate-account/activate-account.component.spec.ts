// activate-account.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  success = false;
  error = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    
    if (!token) {
      this.error = 'No activation token provided.';
      this.loading = false;
      return;
    }

    this.authService.activateAccount(token).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        // Auto-redirect after 3 seconds
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.error = err.error || 'Activation failed. The token may be invalid or expired.';
        this.loading = false;
      }
    });
  }
}