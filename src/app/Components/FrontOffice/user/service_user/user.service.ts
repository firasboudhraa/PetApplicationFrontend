import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user_model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/user';

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/retrieve-user/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-user/${id}`);
  }

  updateUserWithImage(formData: FormData, userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/modify-user/${userId}`, formData);
  }

    // Fetch the user adoption preferences
    getAdoptionPreferences(userId: number): Observable<Map<string, string>> {
      return this.http.get<Map<string, string>>(`${this.apiUrl}/${userId}/adoptionPreferences`);
    }
  
    // Update the user adoption preferences
    updateAdoptionPreferences(userId: number, preferences: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/${userId}/adoptionPreferences`, preferences);
    }
  
}