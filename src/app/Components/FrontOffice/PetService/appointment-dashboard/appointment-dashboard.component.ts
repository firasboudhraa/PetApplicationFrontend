import { Component } from '@angular/core';

@Component({
  selector: 'app-appointment-dashboard',
  templateUrl: './appointment-dashboard.component.html',
  styleUrls: ['./appointment-dashboard.component.css']
})
export class AppointmentDashboardComponent {
  activeTab: string = 'Received'; 

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

}
