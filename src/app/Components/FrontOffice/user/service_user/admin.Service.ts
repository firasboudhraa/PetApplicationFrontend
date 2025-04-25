import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User, UserUpdateRequest } from '../models/user_model';

@Injectable({
  providedIn: 'root'
})

export class adminService {

  constructor(private http : HttpClient) { }
  private apiUrl = 'http://localhost:8081/api/admin'; ;

getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/retrieve-all-users`);
}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/retrieve-user/${id}`); 
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-user/${id}`);
  }
  updateUser(updateData: UserUpdateRequest, userId: number): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/modify-user/${userId}`,
      updateData
    );
  }

}
