import {
  Component,
  ViewChild,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';
import { User } from 'src/app/Components/FrontOffice/user/models/user_model';
import { UserService } from 'src/app/Components/FrontOffice/user/service_user/user.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { NotificationM } from 'src/app/models/notification';

@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.css'],
})
export class HeaderProfileComponent {
  user: User | undefined;
  userId: number | undefined;
  profileImageUrl: string = '';
  notifications: NotificationM[] = [];
  dropdownOpen = false;

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getDecodedToken()?.userId;

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user: User) => {
          this.user = user;
          if (user.profileImageUrl) {
            this.profileImageUrl = `http://localhost:8084${user.profileImageUrl}`;
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
    }

    // First, fetch unseen notifications
    this.notificationService
      .fetchUnseenNotifications(`${this.userId}`)
      .subscribe((unseen) => {
        this.notifications = unseen;

        // Then subscribe to live notifications
        this.notificationService.notifications$.subscribe((newLive) => {
          this.notifications = [...newLive, ...this.notifications]; // merge
          this.notifications = this.removeDuplicates(this.notifications);
        });
      });

    this.notificationService.connect(`${this.userId}`);
  }

  removeDuplicates(notifs: NotificationM[]): NotificationM[] {
    const seen = new Set();
    return notifs.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }

  get unseenCount(): number {
    return this.notifications.filter((n) => !n.seen).length;
  }
  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  markAsRead(notification: NotificationM): void {
    if (!notification.seen) {
      this.notificationService.markAsSeen(notification.id).subscribe(() => {
        notification.seen = true; 
      });
    }
  }
}
