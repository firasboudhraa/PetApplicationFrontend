import  { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {

  private apiURL = `${environment.apiUrl}notifications/all-notifications`; 
  constructor(private http : HttpClient) { }

  getAllNotifications() : Observable<Notification[]> {
    return this.http.get<[Notification]>(this.apiURL);
  }

    // Mark a notification as read
    markAllAsRead(): Observable<any> {
      return this.http.put(`${environment.apiUrl}notifications/read-all`, {});
    }
}
