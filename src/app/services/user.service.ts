import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
 constructor(private authService: AuthService) {}

  getCurrentUserId(): number {
    const decodedToken = this.authService.getDecodedToken();
    if (!decodedToken?.userId) {
      throw new Error('User ID not found in token');
    }
    return decodedToken.userId;
  }
}