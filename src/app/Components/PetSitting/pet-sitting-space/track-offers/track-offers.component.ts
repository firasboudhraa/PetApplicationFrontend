import { Component, OnInit } from '@angular/core';
import { cl } from '@fullcalendar/core/internal-common';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/Components/FrontOffice/user/service_user/user.service';
import { PetSittingOfferService } from 'src/app/Services/pet-sitting-offer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-track-offers',
  templateUrl: './track-offers.component.html',
  styleUrls: ['./track-offers.component.css'],
})
export class TrackOffersComponent implements OnInit {
  activeTab: string = 'sent';
  sentOffers: any[] = []; 
  receivedOffers: any[] = []; 
  userId: number = 1; 
  private imageServerUrl = 'http://localhost:8222/api/v1/pet/images';

  constructor( private petSittingService :PetSittingOfferService , private userService:UserService) {}

  ngOnInit(): void {
    
    this.fetchSentOffers();
    this.fetchReceivedOffers();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  fetchSentOffers(): void {
    this.petSittingService.getSentPetSittingOffers(this.userId).subscribe(async (response) => {
      this.sentOffers = await Promise.all(
        response.map(async (offer) => {
          // Get the owner's full name asynchronously
          const user = await this.userService.getUserById(offer.pet.ownerId).toPromise();
          if (user) {

            const userName = this.capitalizeFirstLetter(user.lastName) + this.capitalizeFirstLetter(user.firstName) ;
            return { ...offer, userName }; 
          }else return offer ;
          
        })
      );
  
    });
  }
  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  

  fetchReceivedOffers(): void {
    this.petSittingService.getReceivedPetSittingOffers(this.userId).subscribe(async (response) => {
      this.receivedOffers = await Promise.all(
        response.map(async (offer) => {
          offer.userRequestStatuses = await Promise.all(
            offer.userRequestStatuses.map(async (s) => {
              try{

                const user = await this.userService.getUserById(s.userId).toPromise();
              
              if (user) {
                const userName = this.capitalizeFirstLetter(user.lastName) + ' ' + this.capitalizeFirstLetter(user.firstName);
                console.log({ ...s, userName })
                return { ...s, userName }; 
              }
              }catch{
                
              }
              return s; 
            })
          );
          return offer;  
        })
      );
    });
  }
  
  

  

  cancelOffer(offerId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.petSittingService.cancelPetSittingOffer(offerId,this.userId).subscribe((response) => {
          console.log('Request canceled:', response);
          Swal.fire('Canceled!', 'The Request has been canceled.', 'success');
          this.fetchSentOffers();
        }, (error) => {
          console.error('Error canceling offer:', error);
          Swal.fire('Error!', 'There was an error canceling the Request.', 'error');
        });
      }
    });

  }

  acceptOffer(offerId: number,requesterId:number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.petSittingService.confirmPetSittingOffer(offerId,requesterId).subscribe((response) => {
          console.log('Offer accepted:', response);
          Swal.fire('Accepted!', 'The offer has been accepted.', 'success');
          this.fetchReceivedOffers(); // Refresh the received offers
        }, (error) => {
          console.error('Error accepting offer:', error);
          Swal.fire('Error!', 'There was an error accepting the offer.', 'error');
        });
      }
    });
    console.log('Accept offer:', offerId);
    // Add logic to accept the offer
  }

  rejectOffer(offerId: number,requesterId:number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.petSittingService.rejectPetSittingOffer(offerId,requesterId).subscribe((response) => {
          console.log('Offer rejected:', response);
          Swal.fire('Rejected!', 'The offer has been rejected.', 'success');
          this.fetchReceivedOffers(); // Refresh the received offers
        }, (error) => {
          console.error('Error rejecting offer:', error);
          Swal.fire('Error!', 'There was an error rejecting the offer.', 'error');
        });
      }
    }
    );
  }
  getImageUrl(filename: string): string {
    return `${this.imageServerUrl}/${filename}`;
  }
  
}
