import { Component, OnInit, Renderer2 } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { PetSittingOffer } from 'src/app/models/petSittingOffer';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetSittingOfferService } from 'src/app/Services/pet-sitting-offer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pet-sitting-space',
  templateUrl: './pet-sitting-space.component.html',
  styleUrls: ['./pet-sitting-space.component.css'],
})
export class PetSittingSpaceComponent implements OnInit {
  userId: number = 2;
  private imageServerUrl = 'http://localhost:8222/api/v1/pet/images';
  showDetailModal: boolean = false;
  offers: (PetSittingOffer & { isFlipped: boolean })[] = []; // Add isFlipped dynamically

  constructor(private petSittingOfferService: PetSittingOfferService, private mapService: GoogleMapsLoaderService,private renderer: Renderer2) {}

  ngOnInit(): void {
    this.petSittingOfferService.getAvailablePetSittingOffers(this.userId).subscribe(async (response) => {
      this.offers = await Promise.all(
        response.map(async (offer) => ({
          ...offer,
          locationInLetters: await this.mapService.getLocationInLetters(offer.pet.location), // Await the result
          isFlipped: false,
        }))
      );
      console.log(this.offers);
    });
  }
  closeDetailModal(): void {
    this.renderer.removeClass(document.querySelector('.pet-sitting-space-container'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-footer'), 'blur-effect');
    this.showDetailModal = false;
  }
  isOfferSent(offer: PetSittingOffer): boolean {
    return offer.userRequestStatuses.some((status) => status.userId === this.userId );
  }
  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return diffDays;
  }
  toggleFlip(offerId: number): void {
    const offer = this.offers.find((o) => o.id === offerId);
    if (offer) {
      offer.isFlipped = !offer.isFlipped; 
    }
  }

  getImageUrl(filename: string): string {
    return `${this.imageServerUrl}/${filename}`;
  }

  applyFilter(filter: string): void {
    console.log('Filter applied:', filter);
  }
  selectedPet!: Pet ;
  viewPetDetail(pet: Pet): void {
    this.selectedPet = pet;
    this.showDetailModal = true;
    this.renderer.addClass(document.querySelector('.pet-sitting-space-container'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-footer'), 'blur-effect');
  }
  sendOffer(offerId: number): void {
    this.petSittingOfferService.requestPetSittingOffer(offerId, this.userId).subscribe({
      next: (response) => {
        console.log('Offer sent successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your pet sitting offer has been sent successfully!',
          confirmButtonText: 'OK',
        }).then(() => {
        //  this.offers = this.offers.filter((offer) => offer.id !== offerId);
        });
      },
      error: (error) => {
        console.log('Error sending offer:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while sending the pet sitting offer. Please try again later.',
          confirmButtonText: 'OK',
        });
        console.error('Error sending offer:', error);
      },
    });
  }
}
