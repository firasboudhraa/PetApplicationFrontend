import { Component } from '@angular/core';
import { AdoptionRequestService } from 'src/app/Services/adoption-request.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-received-request',
  templateUrl: './received-request.component.html',
  styleUrls: ['./received-request.component.css']
})
export class ReceivedRequestComponent {
pendingRequests: any[] = [];
  confirmedRequests: any[] = [];
  rejectedRequests: any[] = [];
  userId:number = 1 ;
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
  deleteRequest(requestId: number): void {
    this.adoptionRequestService.deleteAdoptionRequest(requestId).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Request deleted',
        text: '✅ The Request was removed successfully!',
        position: 'top',
        timer: 3000,
        showConfirmButton: false,
        toast: true
      });
      this.fetchAdoptionRequests(); // Refresh the requests after deletion
    }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to delete pet.',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        });
  }
  
  showOptions: number | null = null;  // Store the ID of the request whose options are visible

  toggleOptions(requestId: number) {
    // If the clicked request is the one that already has visible options, hide them
    if (this.showOptions === requestId) {
      this.showOptions = null;
    } else {
      this.showOptions = requestId;
    }
  }
  fetchAdoptionRequests() {
    this.adoptionRequestService.getReceivedAdoptionRequest(this.userId).subscribe(async requests => {
      console.log('All Requests:', requests);

      const pendingRequestsPromises = requests
        .map(async request => {
          request.adoptedPet.imagePath = this.getImageUrl(request.adoptedPet.imagePath);
        //  request.location = await this.mapsLoader.getLocationInLetters(request.location); // Use the service
          return request;
        });

      this.pendingRequests = (await Promise.all(pendingRequestsPromises)).filter(request =>! request.isConfirmed);
      console.log('Pending Requests:', this.pendingRequests);

      this.confirmedRequests = requests.filter(request => request.isConfirmed === true);
      console.log('Confirmed Requests:', this.confirmedRequests);

      this.rejectedRequests = requests.filter(request => request.isRejected === false);
      console.log('Rejected Requests:', this.rejectedRequests);
    });
  }
  
}
