import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  notifications: Notification[] = [];
  dropdownOpen = false;
  userId :number = 1; 

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // First, fetch unseen notifications
    this.notificationService.fetchUnseenNotifications(`${this.userId}`).subscribe((unseen) => {
      this.notifications = unseen;
  
      // Then subscribe to live notifications
      this.notificationService.notifications$.subscribe((newLive) => {
        this.notifications = [...newLive, ...this.notifications]; // merge
        this.notifications = this.removeDuplicates(this.notifications);
      });
    });
  
    this.notificationService.connect(`${this.userId}`);
  }
  removeDuplicates(notifs: Notification[]): Notification[] {
    const seen = new Set();
    return notifs.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }

  get unseenCount(): number {
    return this.notifications.filter(n => !n.seen).length;
  }
  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  markAsRead(notification: Notification): void {
    if (!notification.seen) {
      this.notificationService.markAsSeen(notification.id).subscribe(() => {
        notification.seen = true; // Mark as seen in the UI
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.dropdownRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
}
