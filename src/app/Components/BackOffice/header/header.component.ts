import  { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationServiceService } from 'src/app/Services/notification-service.service';
import { Notification } from 'src/app/models/notification'; // Import the Notification model
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  notifications: Notification[] = []; 
  unreadCount!:number ;


  constructor(
    private notificationService: NotificationServiceService,
    private datePipe: DatePipe) {}


    ngOnInit(): void {
      this.loadNotifications();
    }
  
    loadNotifications(): void {
      this.notificationService.getAllNotifications().subscribe(
        (data: Notification[]) => {
          this.notifications = data;
          this.unreadCount = this.notifications.filter(notif => !Boolean(notif.isRead)).length;
        },
        error => {
          console.error('Error fetching notifications:', error);
        }
      );
    }
  
    openNotifications(): void {
      this.notificationService.markAllAsRead().subscribe(() => {
        this.unreadCount = 0; 
     
        const htmlContent = this.notifications.map((notif, index) => {
          const formattedDate = this.datePipe.transform(notif.createdAt, 'MMMM dd, yyyy h:mm a');
          return `
            <li class="list-group-item">
              <div class="notif-item d-flex flex-column">
                <div><i class="fa ${this.getNotificationIcon(notif.type)} me-2"></i>${notif.message}</div>
                <small class="notif-time text-muted mt-1">${formattedDate}</small>
              </div>
            </li>`;
        }).join('');
    
        Swal.fire({
          title: 'Notifications',
          html: `
            <div class="notif-scroll" style="max-height: 400px; overflow-y: auto;">
              <ul class="list-group">${htmlContent}</ul>
            </div>`,
          width: '600px',
          showCloseButton: true,
          confirmButtonText: 'Close',
          customClass: {
            popup: 'notif-popup'
          }
        });
      });
    }    
    
  
    getNotificationIcon(type: string): string {
      switch (type) {
        case 'user':
          return 'fa-user-plus';
        case 'message':
          return 'fa-comment';
        case 'like':
          return 'fa-heart';
        default:
          return 'fa-bell';
      }
    }
}
