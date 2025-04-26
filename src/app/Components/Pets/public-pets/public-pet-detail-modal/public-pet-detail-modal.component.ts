import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Pet } from 'src/app/models/pet';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-public-pet-detail-modal',
  templateUrl: './public-pet-detail-modal.component.html',
  styleUrls: ['./public-pet-detail-modal.component.css']
})
export class PublicPetDetailModalComponent {
@Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() pet!: Pet; 
  @Input() userId!:number;

  confirmationShowed: boolean = false;
  mapOpened: boolean = false;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';
  constructor(private petDataService : PetdataServiceService , private router:Router , private mapsLoader: GoogleMapsLoaderService){}
  ngOnInit(): void {
    this.mapsLoader.load().then(() => {
      this.initMap();
    }).catch(err => {
      console.error('Google Maps failed to load', err);
    });  }

    ngOnChanges(changes: SimpleChanges): void {
      // if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      //   // Delay to ensure modal is rendered in DOM
      //   setTimeout(() => {
      //     this.mapsLoader.load().then(() => {
      //       this.initMap();
      //     }).catch(err => {
      //       console.error('Google Maps failed to load', err);
      //     });
      //   }, 300);
      // }
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
    openMap() {
      if (!this.pet.location) return ; 
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
    this.close.emit();
  }
 
  redirectToRequest(petId:number ,  ownerId:number , userId:number){
    this.closeModal();
    this.router.navigate(['/adoption-request'], {
      queryParams: { petId, userId, ownerId }
    });  }

  
}
