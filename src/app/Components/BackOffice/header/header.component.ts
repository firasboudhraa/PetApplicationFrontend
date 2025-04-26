import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import Swal from 'sweetalert2';
import { WebsocketService } from '../../../Services/websocket-service.service'
import { NotificationServiceService } from 'src/app/Services/notification-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount!: number;
  dropdownOpen = false;

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor(
    private websocketService: WebsocketService,
    private notificationService: NotificationServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // 1. Fetch existing unseen notifications
    this.notificationService.getAllNotifications().subscribe((data: Notification[]) => {
      this.notifications = data.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
      this.unreadCount = this.notifications.filter(notif => !notif.isRead).length;
    });

    // 2. Subscribe to WebSocket notifications
    this.websocketService.notifications$.subscribe((newNotifs: Notification[]) => {
      this.notifications = this.removeDuplicates([...newNotifs, ...this.notifications]);
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    });

    // 3. Connect WebSocket
    this.websocketService.connect();
  }

  removeDuplicates(notifs: Notification[]): Notification[] {
    const seen = new Set();
    return notifs.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }


    isRecent(notif: Notification): boolean {
      if (!notif.createdAt) return false;
      const notifDate = new Date(notif.createdAt);
      const now = new Date();
      const diffInMinutes = (now.getTime() - notifDate.getTime()) / (1000 * 60);
      return diffInMinutes < 3;
    }
    
    openNotifications(): void {
      this.notificationService.markAllAsRead().subscribe(() => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
      });
    }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'APPOINTMENT_CREATED': return 'fa-calendar-plus';
      case 'APPOINTMENT_REJECTED': return 'fa-calendar-times';
      case 'APPOINTMENT_REMINDER': return 'fa-bell';
      case 'APPOINTMENT_UPDATED': return 'fa-calendar-check';
      case 'APPOINTMENT_DELETED': return 'fa-calendar-minus';
      case 'SERVICE_CREATED': return 'fa-plus-circle';
      case 'SERVICE_UPDATED': return 'fa-edit';
      case 'SERVICE_DELETED': return 'fa-trash';
      default: return 'fa-info-circle';
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.dropdownRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
}
