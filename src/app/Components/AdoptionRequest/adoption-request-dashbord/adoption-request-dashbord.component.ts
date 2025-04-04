import { Component } from '@angular/core';
import { AdoptionRequest } from 'src/app/models/adoptionRequest';
import { AdoptionRequestService } from 'src/app/Services/adoption-request.service';

@Component({
  selector: 'app-adoption-request-dashbord',
  templateUrl: './adoption-request-dashbord.component.html',
  styleUrls: ['./adoption-request-dashbord.component.css']
})
export class AdoptionRequestDashbordComponent {
  pendingRequests: AdoptionRequest[] = [];
  confirmedRequests: AdoptionRequest[] = [];
  rejectedRequests: AdoptionRequest[] = [];
  userId:number = 2 ;
  activeTab: string = 'pending'; // Default tab

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }  
  constructor(private adoptionRequestService: AdoptionRequestService) {}

  ngOnInit(): void {
    this.fetchAdoptionRequests();
    console.log(this.pendingRequests);
    console.log(this.confirmedRequests);
    console.log(this.rejectedRequests);
  }

  fetchAdoptionRequests() {
    this.adoptionRequestService.getAdoptionRequests(this.userId).subscribe(requests => {

      this.pendingRequests = requests.filter(request => request.isConfirmed === false );
      this.confirmedRequests = requests.filter(request => request.isConfirmed === true);
      this.rejectedRequests = requests.filter(request => request.isChangedByPetOwner === true); // assuming rejection is based on change flag
    });
  }
}
