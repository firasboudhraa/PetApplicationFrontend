import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from 'src/app/models/userDTO'; // Import UserDTO model

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/user';

  constructor(private http: HttpClient) { }

  // Fetch user by ID
  getUserById(userId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/retrieve-user/${userId}`);
  }
  
}
