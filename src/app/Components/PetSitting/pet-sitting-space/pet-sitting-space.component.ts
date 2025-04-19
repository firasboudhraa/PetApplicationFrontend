import { Component, OnInit, Renderer2 } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { PetSittingOffer } from 'src/app/models/petSittingOffer';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetSittingOfferService } from 'src/app/Services/pet-sitting-offer.service';

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
    });
  }
  closeDetailModal(): void {
    this.renderer.removeClass(document.querySelector('.pet-sitting-space-container'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-footer'), 'blur-effect');
    this.showDetailModal = false;
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
}
