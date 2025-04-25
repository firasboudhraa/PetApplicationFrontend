import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:8082/posts'; // Mettez ici l'URL de votre backend

  constructor(private http: HttpClient) {}

  sendDeletionEmail(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sendDeletionEmail/${postId}`, {});
  }
}
