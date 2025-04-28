import { Component } from '@angular/core';
import { AdoptionRequestService } from 'src/app/Services/adoption-request.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';

@Component({
  selector: 'app-received-request',
  templateUrl: './received-request.component.html',
  styleUrls: ['./received-request.component.css']
})
export class ReceivedRequestComponent {
pendingRequests: any[] = [];
  confirmedRequests: any[] = [];
  rejectedRequests: any[] = [];
  userId!:any;
  activeTab: string = 'pending'; // Default tab
  private imageApiUrl = 'http://localhost:8222/api/v1/pet/images';
  requestId = 0;

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }  
  constructor(
    private adoptionRequestService: AdoptionRequestService,
    private mapsLoader: GoogleMapsLoaderService,
    private router: Router ,
    private authService:AuthService ,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getDecodedToken() ? this.authService.getDecodedToken()?.userId : 0 ;
    this.mapsLoader.load().then(() => {
      this.fetchAdoptionRequests();
    }).catch(err => {
      console.error('Google Maps failed to load:', err);
    });
  }

  getImageUrl(filename: string): string {
    return `${this.imageApiUrl}/${filename}`;
  }
  rejectRequest(){
    Swal.fire({
      icon: 'warning',
      title: 'Tell him why you rejected the request',
      input: 'textarea',
      inputPlaceholder: 'Enter the reason for rejection',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: (reason) => {
        return   this.adoptionRequestService.rejectAdoptionRequest(this.requestId, reason).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Request rejected',
            text: '✅ The Request was rejected successfully!',
          });
          this.fetchAdoptionRequests();
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to reject request.',
          });
        });
      },
      position: 'top',
      showConfirmButton: true,
      toast: true
    });
  }
  confirmRequest(requestId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'No, cancel!',
      position: 'top',
      toast: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.adoptionRequestService.confirmAdoptionRequest(requestId).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Request confirmed',
            text: '✅ The Request was confirmed successfully!',
            position: 'top',
            timer: 3000,
            toast: true
          });
          this.fetchAdoptionRequests(); 
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to confirm request.',
            position: 'top',
            timer: 3000,
            toast: true
          });
        });
      }
    });
  }
  redirectToEdit(requestId: number): void {
    this.router.navigate(['/edit-adoption-request'], { queryParams: { requestId: requestId } });
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
      this.fetchAdoptionRequests(); 
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
 
  confirmTransfer(adoptionRequestId :number , petId:number ,  newOwnerId:number ){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, transfer it!',
      cancelButtonText: 'No, cancel!',
      position: 'top',
      toast: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.adoptionRequestService.transferPet(adoptionRequestId,petId ,newOwnerId).subscribe(data => {
          Swal.fire({
            icon: 'success',
            title: 'Pet Transfered',
            text: '✅ The Pet was transfered to the new owner successfully!',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
          this.fetchAdoptionRequests(); 
        })
      }
      });
  }
  toggleMenu(requestId: number) {
    this.requestId = this.requestId === requestId ? 0 : requestId;
  }
  fetchAdoptionRequests() {
    this.adoptionRequestService.getReceivedAdoptionRequest(this.userId).subscribe(async requests => {
      console.log('All Requests:', requests);

      const pendingRequestsPromises = requests
        .map(async request => {
          request.adoptedPet.imagePath = this.getImageUrl(request.adoptedPet.imagePath);
         request.location = await this.mapsLoader.getLocationInLetters(request.location); // Use the service
          return request;
        });

      this.pendingRequests = (await Promise.all(pendingRequestsPromises)).filter(request =>! request.isConfirmed && !request.isRejected);
      console.log('Pending Requests:', this.pendingRequests);

      this.confirmedRequests = requests.filter(request => request.isConfirmed && !request.isRejected);
      console.log('Confirmed Requests:', this.confirmedRequests);

      this.rejectedRequests = requests.filter(request => request.isRejected && !request.isConfirmed );
      console.log('Rejected Requests:', this.rejectedRequests );
    });
  }
  
}
