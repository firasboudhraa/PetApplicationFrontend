import { Component } from '@angular/core';

@Component({
  selector: 'app-user-appointment-dashboard',
  templateUrl: './user-appointment-dashboard.component.html',
  styleUrls: ['./user-appointment-dashboard.component.css']
})
export class UserAppointmentDashboardComponent {
  activeTab: string = 'Sent'; 

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
