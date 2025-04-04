import { Component } from '@angular/core';
import { AdoptionRequestService } from 'src/app/Services/adoption-request.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';

@Component({
  selector: 'app-adoption-request-dashbord',
  templateUrl: './adoption-request-dashbord.component.html',
  styleUrls: ['./adoption-request-dashbord.component.css']
})
export class AdoptionRequestDashbordComponent {
  pendingRequests: any[] = [];
  confirmedRequests: any[] = [];
  rejectedRequests: any[] = [];
  userId:number = 2 ;
  activeTab: string = 'pending'; // Default tab
  private imageApiUrl = 'http://localhost:8222/api/v1/pet/images';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }  
  constructor(
    private adoptionRequestService: AdoptionRequestService,
    private mapsLoader: GoogleMapsLoaderService
  ) {}

  ngOnInit(): void {
    this.mapsLoader.load().then(() => {
      this.fetchAdoptionRequests();
    }).catch(err => {
      console.error('Google Maps failed to load:', err);
    });
  }

  getImageUrl(filename: string): string {
    return `${this.imageApiUrl}/${filename}`;
  }

  fetchAdoptionRequests() {
    this.adoptionRequestService.getAdoptionRequests(this.userId).subscribe(async requests => {
      console.log('All Requests:', requests);

      const pendingRequestsPromises = requests
        .filter(request => request.isConfirmed === false)
        .map(async request => {
          request.adoptedPet.imagePath = this.getImageUrl(request.adoptedPet.imagePath);
          request.location = await this.mapsLoader.getLocationInLetters(request.location); // Use the service
          return request;
        });

      this.pendingRequests = await Promise.all(pendingRequestsPromises);
      console.log('Pending Requests:', this.pendingRequests);

      this.confirmedRequests = requests.filter(request => request.isConfirmed === true);
      console.log('Confirmed Requests:', this.confirmedRequests);

      this.rejectedRequests = requests.filter(request => request.isChangedByPetOwner === true);
      console.log('Rejected Requests:', this.rejectedRequests);
    });
  }
}
