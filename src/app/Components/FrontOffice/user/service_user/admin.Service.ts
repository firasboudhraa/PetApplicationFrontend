import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserUpdateRequest } from '../models/user_model';

@Injectable({
  providedIn: 'root'
})
export class adminService {
  private apiUrl = 'http://localhost:8084/api/admin';
  
  constructor(private http: HttpClient) { }
  
  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}/retrieve-all-users`,
      { headers: this.getAuthHeaders() }
    );
  }
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/retrieve-user/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/remove-user/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
  
  updateUser(updateData: UserUpdateRequest, userId: number): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/modify-user/${userId}`,
      updateData,
      { headers: this.getAuthHeaders() }
    );
  }
  

}