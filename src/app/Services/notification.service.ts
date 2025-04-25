import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationM } from 'src/app/models/notification'; // Import the Notification model
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient: Client;
  private notificationsSubject = new BehaviorSubject<NotificationM[]>([]); // Notifications store
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {
    const socket = new SockJS('http://localhost:8055/ws-notifications');
    this.stompClient = new Client({
      webSocketFactory: () => socket as WebSocket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str)
    });
  }

  connect(userId: string): void {
    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');

      this.stompClient.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
        const notification: NotificationM = JSON.parse(message.body);
        const current = this.notificationsSubject.value;
        const updated = [notification, ...current];
        this.notificationsSubject.next(updated);
      });
    };

    this.stompClient.activate();
  }

  // Fetch unseen notifications from the database
  fetchUnseenNotifications(userId: string): Observable<NotificationM[]> {
    return this.http.get<NotificationM[]>(`http://localhost:8055/notifications/${userId}`);
  }

  markAsSeen(notificationId: number): Observable<void> {
    return this.http.put<void>(`http://localhost:8055/notifications/seen/${notificationId}`, {});
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('WebSocket disconnected');
    }
  }
}
