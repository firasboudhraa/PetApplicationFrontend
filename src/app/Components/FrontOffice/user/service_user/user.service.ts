import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user_model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8084/api/user';
  
  constructor(private http: HttpClient) { }
  
  /**
   * Get user by ID
   * @param id User ID
   * @returns Observable with User data
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/retrieve-user/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Hard delete user (complete removal)
   * @param id User ID
   * @returns Observable with void response
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-user/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Soft delete user (mark as inactive)
   * @param id User ID
   * @returns Observable with response
   */
  softDeleteUser(id: number): Observable<any> {
    console.log(`Sending soft delete request to: ${this.apiUrl}/${id}/soft-delete`);
    // Try with proper content type and response type
    return this.http.delete<any>(`${this.apiUrl}/${id}/soft-delete`, {
      observe: 'response',
      responseType: 'json' as 'json'
    })
    .pipe(
      catchError((error) => {
        console.error('Soft delete error details:', error);
        return this.handleError(error);
      })
    );
  }
  
  /**
   * Update user with profile image
   * @param formData Form data containing user info and image
   * @param userId User ID
   * @returns Observable with updated User data
   */
  updateUserWithImage(formData: FormData, userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/modify-user/${userId}`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Update user without changing profile image
   * @param userData User data to update
   * @param userId User ID
   * @returns Observable with updated User data
   */
  updateUser(userData: User, userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/modify-user/${userId}`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Add this method to your UserService class

  updateUserProfileImage(formData: FormData, userId: number) {
    return this.http.put(`${this.apiUrl}/update-profile-image/${userId}`, formData);
  }
  /**
   * Get user adoption preferences
   * @param userId User ID
   * @returns Observable with adoption preferences
   */
  getAdoptionPreferences(userId: number): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.apiUrl}/${userId}/adoptionPreferences`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Update user adoption preferences
   * @param userId User ID
   * @param preferences Adoption preferences object
   * @returns Observable with updated preferences
   */
  updateAdoptionPreferences(userId: number, preferences: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/adoptionPreferences`, preferences)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Handle HTTP errors
   * @param error HTTP error response
   * @returns Observable with error message
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }


}