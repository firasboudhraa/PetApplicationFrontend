import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { CompatClient, Stomp } from '@stomp/stompjs';
import  SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: CompatClient | null = null;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    const socket = new SockJS(`${environment.websocketUrl}`);
    this.stompClient = Stomp.over(socket);
  }

  connect(): void {
    if (!this.stompClient) return;

    this.stompClient.connect({}, () => {
      console.log('WebSocket connected');

      this.stompClient?.subscribe(`/topic/notifications`, (message) => {
        const notification: Notification = JSON.parse(message.body);
        const current = this.notificationsSubject.value;
        this.notificationsSubject.next([notification, ...current]);
      });
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
      });
    }
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }
}
