import { Component } from '@angular/core';
import  { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';
import  { User } from 'src/app/Components/FrontOffice/user/models/user_model';
import  { UserService } from 'src/app/Components/FrontOffice/user/service_user/user.service';


@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.css']
})
export class HeaderProfileComponent {
  user: User | undefined;
  userId: number | undefined;
  profileImageUrl: string = ''; // Store the full URL of the image


  constructor(
    private userService: UserService,
    private authService: AuthService  
  ) {}


  ngOnInit(): void {
    this.userId = this.authService.getDecodedToken()?.userId;

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user: User) => {
          this.user = user; 
          if (user.profileImageUrl) {
            this.profileImageUrl = `http://localhost:8084${user.profileImageUrl}`; 
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    }
  }

}
