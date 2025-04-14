import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pet-detail-modal',
  templateUrl: './pet-detail-modal.component.html',
  styleUrls: ['./pet-detail-modal.component.css']
})
export class PetDetailModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() passToEdit = new EventEmitter<void>();
  @Input() pet!: Pet; 
  @Output() petRemoved = new EventEmitter<void>(); 
  confirmationShowed: boolean = false;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';
  constructor(private petDataService : PetdataServiceService , private mapsLoader: GoogleMapsLoaderService ){}
  openEditModal(){
    console.log("clicked") ;
    this.close.emit();
    this.passToEdit.emit() ;
  }
  mapOpened: boolean = false;
  openMap() {
    if (!this.pet.location){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '❌ No location available for this pet.',
        position: 'top',
        timer: 3000,
        showConfirmButton: false,
        toast: true
      });
      return;
    } 
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
  
    // Initialize the map centered on the pet's location
    const map = new google.maps.Map(mapElement, {
      center: location,
      zoom: 14
    });
  
    // Place a marker at the pet's location
    new google.maps.Marker({
      position: location,
      map: map,
      title: `${this.pet.name}'s Location`
    });
  }
  ngOnInit(): void {
    this.mapsLoader.load().then(() => {
      this.initMap();
    }).catch(err => {
      console.error('Google Maps failed to load', err);
    });  }
   ngOnChanges(changes: SimpleChanges): void {
 
        if(this.pet.location) {
  
          const [latStr, lngStr] = this.pet.location.split(',').map(coord => coord.trim());
          const lat = parseFloat(latStr);
          const lng = parseFloat(lngStr);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            this.getAddressFromLatLng(lat, lng);
          } 
        }else {
          this.humanReadableLocation = 'Unknown location';
        }
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
    this.humanReadableLocation = '';
    this.close.emit();
    this.mapOpened = false;
  }
  removePet(id:number) {
    this.petDataService.removePet(id).subscribe({
      next: () => {
        this.closeModal();
        this.petRemoved.emit();
        Swal.fire({
          icon: 'success',
          title: 'Pet deleted',
          text: '✅ Pet was removed successfully!',
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
          toast: true
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '❌ Failed to delete pet.',
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
          toast: true
        });
      }
    });
    this.hideConfirmButton();
  }
  isCatOrDog(specie: string): boolean {
    return specie.toLowerCase() === 'cat' || specie.toLowerCase() === 'dog';  
  }
  discoverBreed(imageUrl: string): void {
    this.petDataService.discoverBreed(imageUrl).subscribe(
      (response) => {
        console.log('Breed discovered successfully:', response);
        const breed = response.breed; // Adjust based on the actual response structure

        Swal.fire({
          icon: 'success',
          title: '✨ Breed Discovered ✨',
          html: `<strong>✅ Your pet breed is:</strong> <span style="color: #6a11cb; font-weight: bold;">${breed}</span>`,
          position: 'top',
          showConfirmButton: true,
          toast: false,

        });
      },
      (error) => {
        console.error('Error discovering breed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '❌ Failed to discover breed.',
          position: 'top',
          showConfirmButton: true,
          toast: true,
        });
      }
    );
  }
}

