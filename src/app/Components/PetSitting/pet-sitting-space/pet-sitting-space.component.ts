import { Component, OnInit } from '@angular/core';
import { PetSittingOffer } from 'src/app/models/petSittingOffer';
import { PetSittingOfferService } from 'src/app/Services/pet-sitting-offer.service';

@Component({
  selector: 'app-pet-sitting-space',
  templateUrl: './pet-sitting-space.component.html',
  styleUrls: ['./pet-sitting-space.component.css'],
})
export class PetSittingSpaceComponent implements OnInit {
  userId: number = 2;
  private imageServerUrl = 'http://localhost:8222/api/v1/pet/images';

  offers: (PetSittingOffer & { isFlipped: boolean })[] = []; // Add isFlipped dynamically

  constructor(private petSittingOfferService: PetSittingOfferService) {}

  ngOnInit(): void {
    this.petSittingOfferService.getAvailablePetSittingOffers(this.userId).subscribe(
      (response) => {
        this.offers = response.map((offer) => ({
          ...offer,
          isFlipped: false, 
        }));
      }
    );
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

  viewOffer(offer: any): void {
    console.log('Viewing offer:', offer);
  }
}
