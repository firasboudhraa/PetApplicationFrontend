import { Component } from '@angular/core';
import { AdoptionRequestService } from 'src/app/Services/adoption-request.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sent-request',
  templateUrl: './sent-request.component.html',
  styleUrls: ['./sent-request.component.css']
})
export class SentRequestComponent {
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

   
  fetchAdoptionRequests() {
    this.adoptionRequestService.getAdoptionRequests(this.userId).subscribe(async requests => {
      console.log('All Requests:', requests);



      const allRequestsPromises = requests
        .map(async request => {
          request.adoptedPet.imagePath = this.getImageUrl(request.adoptedPet.imagePath);
         // request.location = await this.mapsLoader.getLocationInLetters(request.location); // Use the service
          return request;
        });

      this.pendingRequests = (await Promise.all(allRequestsPromises)).filter(request =>! request.isConfirmed && !request.isRejected);
      console.log('Pending Requests:', this.pendingRequests);

      this.confirmedRequests = requests.filter(request => request.isConfirmed && !request.isRejected);
      console.log('Confirmed Requests:', this.confirmedRequests);

      this.rejectedRequests = requests.filter(request => request.isRejected && !request.isConfirmed );
      console.log('Rejected Requests:', this.rejectedRequests);
    });
  }
}
