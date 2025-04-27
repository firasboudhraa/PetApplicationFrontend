import { Component } from '@angular/core';
import  { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';
import  { User } from 'src/app/Components/FrontOffice/user/models/user_model';
import  { UserService } from 'src/app/Components/FrontOffice/user/service_user/user.service';

@Component({
  selector: 'app-sidebar-profile',
  templateUrl: './sidebar-profile.component.html',
  styleUrls: ['./sidebar-profile.component.css']
})
export class SidebarProfileComponent {
  user: User | undefined;
  userId: number | undefined;


  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getDecodedToken()?.userId; // Get user ID from token

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user: User) => {
          this.user = user; // Assign the user data to the user variable
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    }
  }

}
