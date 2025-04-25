import { Component } from '@angular/core';
import { AdoptionRequestService } from 'src/app/Services/adoption-request.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adoption-request-dashbord',
  templateUrl: './adoption-request-dashbord.component.html',
  styleUrls: ['./adoption-request-dashbord.component.css']
})
export class AdoptionRequestDashbordComponent {
  activeTab: string = 'Sent'; // Default tab

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
