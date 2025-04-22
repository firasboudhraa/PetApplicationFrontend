import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'; // Import Observable and Subject
import { CompatClient, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notification'; // Import the Notification model

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: CompatClient = {} as CompatClient;
  private notificationsSubject: Subject<Notification> = new Subject<Notification>(); // Subject to emit notifications

  // Modify the connect method to return an Observable (Subject)
  connect(): Observable<any> {
    const socket = new SockJS(`${environment.apiUrl}${environment.webSocketUrl}`);
    this.stompClient = Stomp.over(socket);


    return new Observable<any>((observer) => {
      // Connect to the WebSocket
      this.stompClient.connect({}, (frame: string) => {
        console.log('✅ Connected: ' + frame);

        this.stompClient.subscribe('/topic/notifications', (message) => {
          if (message.body) {
            const data: Notification = JSON.parse(message.body);
            console.log('📨 Notification received:', data);
            this.notificationsSubject.next(data);
          }
        });
        observer.next('Connected to WebSocket');
      }, (error: any) => {
        observer.error('WebSocket connection error: ' + error);
      });
    });
  }

  getNotifications(): Observable<Notification> {
    return this.notificationsSubject.asObservable();
  }




  // Disconnect the WebSocket
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('❌ Disconnected');
      });
    }
  }
}
