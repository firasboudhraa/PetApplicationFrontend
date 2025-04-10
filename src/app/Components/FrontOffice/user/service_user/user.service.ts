import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user_model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http : HttpClient) { }
  private apiUrl = 'http://localhost:8081/api/user'; ;

 

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/retrieve-user/${id}`); 
  }
  addUser(u: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, u);
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  updateUser(u: User, id: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, u);
  }

}




 