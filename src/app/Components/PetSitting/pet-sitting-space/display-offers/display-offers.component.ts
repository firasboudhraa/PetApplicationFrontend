import { Component, Renderer2 } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { PetSittingOffer } from 'src/app/models/petSittingOffer';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetSittingOfferService } from 'src/app/Services/pet-sitting-offer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-offers',
  templateUrl: './display-offers.component.html',
  styleUrls: ['./display-offers.component.css']
})
export class DisplayOffersComponent {
  userId: number = 3;
  private imageServerUrl = 'http://localhost:8222/api/v1/pet/images';
  showDetailModal: boolean = false;
  searchText: string = '';
  selectedSpecie: string = '';
  selectedOfferType: string = '';
  selectedSex: string = '';

  displayedOffers: (PetSittingOffer & { isFlipped: boolean })[] = [];
  offersToShow = 3;

  allOffers: (PetSittingOffer & { isFlipped: boolean })[] = [];

  offers: (PetSittingOffer & { isFlipped: boolean })[] = []; // Add isFlipped dynamically

  constructor(private petSittingOfferService: PetSittingOfferService, private mapService: GoogleMapsLoaderService,private renderer: Renderer2) {}

  ngOnInit(): void {
    this.petSittingOfferService.getAvailablePetSittingOffers(this.userId).subscribe(async (response) => {
      this.allOffers = await Promise.all(
        response.map(async (offer) => ({
          ...offer,
          locationInLetters: await this.mapService.getLocationInLetters(offer.pet.location),
          isFlipped: false,
        }))
      );
      this.offers = [...this.allOffers]; // Initially, show all
      this.displayedOffers = this.offers.slice(0, this.offersToShow);

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

  applyFilter(type?: string, value?: string): void {
    if (type === 'specie') {
      this.selectedSpecie = value || '';
    } else if (type === 'offerType') {
      this.selectedOfferType = value || '';
    } else if (type === 'sex') {
      this.selectedSex = value || '';
    }
  
    this.offers = this.allOffers.filter(offer => {
      const matchesSearch = this.searchText
        ? (offer.pet.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
           offer.locationInLetters?.toLowerCase().includes(this.searchText.toLowerCase()) ||
           offer.pet.species?.toLowerCase().includes(this.searchText.toLowerCase()))
        : true;
  
      const matchesSpecie = this.selectedSpecie ? offer.pet.species?.toLowerCase() === this.selectedSpecie.toLowerCase() : true;
      const matchesOfferType = this.selectedOfferType ? offer.offerType?.toLowerCase() === this.selectedOfferType.toLowerCase() : true;
      const matchesSex = this.selectedSex ? offer.pet.sex?.toLowerCase() === this.selectedSex.toLowerCase() : true;
  
      return matchesSearch && matchesSpecie && matchesOfferType && matchesSex;
    });
    this.displayedOffers = this.offers.slice(0, this.offersToShow);

  }
  showMoreOffers() {
    this.offersToShow += 6; 
    this.displayedOffers = this.offers.slice(0, this.offersToShow);
  }
  clearFilters(): void {
    this.searchText = '';
    this.selectedSpecie = '';
    this.selectedOfferType = '';
    this.offers = [...this.allOffers];
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
