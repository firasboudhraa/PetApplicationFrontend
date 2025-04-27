import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Pet, MatchingPetInfo } from 'src/app/models/pet';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';
import { MatchingService } from '../matching.service';

@Component({
  selector: 'app-matching-detail-modal',
  templateUrl: './matching-detail-modal.component.html',
  styleUrls: ['./matching-detail-modal.component.css']
})
export class MatchingDetailModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() pet!: MatchingPetInfo; 
  @Input() userId!: number;

  confirmationShowed: boolean = false;
  mapOpened: boolean = false;
  activeView: string = 'details';
  
  // Set default values for match data to avoid "undefined" errors
  matchData: any = {
    score: null,
    reasons: [],
    consideration: ''
  };
  
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';
  
  private apiUrl = 'http://localhost:8222/api/v1/pet/images';
  
  constructor(
    private petDataService: PetdataServiceService, 
    private router: Router, 
    private mapsLoader: GoogleMapsLoaderService,
    private matchingService: MatchingService
  ) {}
  
  ngOnInit(): void {
    this.mapsLoader.load().then(() => {
      if (this.mapOpened) {
        this.initMap();
      }
    }).catch(err => {
      console.error('Google Maps failed to load', err);
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible && this.pet && this.userId) {
      console.log('Modal is visible with pet:', this.pet);
      
      // Reset error state when modal opens
      this.hasError = false;
      this.errorMessage = '';
      
      // Parse the location if it exists to get human readable address
      if (this.pet.location) {
        const [latStr, lngStr] = this.pet.location.split(',').map(coord => coord.trim());
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          this.getAddressFromLatLng(lat, lng);
        }
      }
      
      // Reset to details view when modal opens
      this.activeView = 'details';
      
      // Load match data only if we switch to match view
      // We'll load it on demand when user clicks the tab
    }
  }

  showMatchInfo(event: Event): void {
    event.preventDefault();
    this.activeView = 'match';
    
    // If match data isn't loaded yet or had an error, try loading again
    if (this.matchData.score === null || this.hasError) {
      this.loadMatchingData();
    }
  }
  
  showPetDetails(): void {
    this.activeView = 'details';
  }

  loadMatchingData(): void {
    if (!this.pet || !this.userId) {
      console.error('Missing pet or userId, cannot load match data');
      this.setErrorState('Missing pet or user information');
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    console.log('Loading match data for user:', this.userId, 'and pet ID:', this.pet.id);
    
    this.matchingService.getMatchesForUser(this.userId).subscribe({
      next: (response) => {
        console.log('Received match data:', response);
        this.isLoading = false;
        
        // Check if response and matches property exist
        if (!response || !response.matches) {
          console.error('Invalid response format:', response);
          this.setErrorState('Invalid response from server');
          return;
        }
        
        // Find the match for the current pet
        const petMatch = response.matches.find(match => match.id === String(this.pet.id));

        if (petMatch) {
          console.log('Found match for pet:', petMatch);
          // Ensure match_score is a number
          const score = typeof petMatch.match_score === 'number' 
            ? petMatch.match_score 
            : parseInt(petMatch.match_score as any);
            
          this.matchData = {
            score: isNaN(score) ? 0 : score,
            reasons: Array.isArray(petMatch.reasons) ? petMatch.reasons : [],
            consideration: petMatch.consideration || 'No specific considerations.'
          };
        } else {
          console.log('No match found for pet ID:', this.pet.id);
          this.matchData = {
            score: 0,
            reasons: ["No matching data available for this pet."],
            consideration: "This pet may not be a good match for your preferences."
          };
        }
      },
      error: (error) => {
        console.error('Error loading match data:', error);
        this.setErrorState('Failed to load match data. Please try again later.');
      }
    });
  }
  
  setErrorState(message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    this.matchData = {
      score: 0,
      reasons: ["Error loading match data"],
      consideration: "Please try again later."
    };
  }
  
  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || !this.pet?.location) return;
  
    // Split the location string into lat/lng
    const [latStr, lngStr] = this.pet.location.split(',').map(coord => coord.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
  
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid pet location:', this.pet.location);
      return;
    }
  
    const location = new google.maps.LatLng(lat, lng);
    const map = new google.maps.Map(mapElement, {
      center: location,
      zoom: 14
    });
  
    new google.maps.Marker({
      position: location,
      map: map,
      title: `${this.pet.name}'s Location`
    });
  }
  
  openMap() {
    if (!this.pet.location) return; 
    this.mapOpened = !this.mapOpened;
    setTimeout(() => {
      this.mapsLoader.load().then(() => {
        this.initMap();
      }).catch(err => {
        console.error('Google Maps failed to load', err);
      });
    }, 300);
  }
  
  humanReadableLocation: string = '';
  
  getAddressFromLatLng(lat: number, lng: number): void {
    this.mapsLoader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat, lng };
    
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          if (results && results[0]) {
            this.humanReadableLocation = results[0].formatted_address;
          } else {
            console.warn('No results found');
            this.humanReadableLocation = 'Unknown location';
          }
        } else {
          console.error('Geocoder failed due to: ' + status);
          this.humanReadableLocation = 'Geocoder failed';
        }
      });
    }).catch(err => {
      console.error('Google Maps failed to load', err);
      this.humanReadableLocation = 'Map service unavailable';
    });
  }

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }
  
  showConfirmButton() {
    this.confirmationShowed = true;
  }
  
  hideConfirmButton() {
    this.confirmationShowed = false;
  }
  
  closeModal() {
    this.activeView = 'details';
    this.close.emit();
  }
 
  redirectToRequest(petId: number, ownerId: number, userId: number) {
    this.closeModal();
    this.router.navigate(['/adoption-request'], {
      queryParams: { petId, userId, ownerId }
    });
  }
}