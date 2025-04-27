import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-detail-modal',
  templateUrl: './service-detail-modal.component.html',
  styleUrls: ['./service-detail-modal.component.css']
})
export class ServiceDetailModalComponent {
  service!: any;
  availableSlots: string[] = [];
  humanReadableLocation: string = '';
  mapOpened: boolean = false;
  isLoadingMap: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Input() id! :number ;
  
  constructor(private ps: PetServiceService, 
              private Act: ActivatedRoute , 
              private router: Router,
              private mapsLoader:GoogleMapsLoaderService) { }

  ngOnInit(): void {
    this.ps.getServiceById(this.id).subscribe(
      (data) => {
        this.service = data;
        this.getAvailableSlots(); 

        if (this.service.address) {
          this.humanReadableLocation = this.formatLocation(this.service.address);
        }
      }
    );
  }
  onClose() {
    this.closeModal.emit();
  }
  getAvailableSlots(): void {
    this.ps.getAvailableSlots(this.id).subscribe(
      (data) => {
        this.availableSlots = data;
        console.log(this.availableSlots);
      }
    );
  }

  openMap() {
    if (!this.service.address){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '❌ No location available for this service.',
        position: 'top',
        timer: 3000,
        showConfirmButton: false,
        toast: true
      });
      return;
    } 
    this.mapOpened = !this.mapOpened;

    if (this.mapOpened) {
      this.isLoadingMap = true;
    }
    setTimeout(() => {
      this.mapsLoader.load().then(() => {
        this.initMap();
        this.isLoadingMap = false; // Hide loading spinner after map is initialized
      }).catch(err => {
        console.error('Google Maps failed to load', err);
        this.isLoadingMap = false; // Hide loading spinner on error
      });
    }, 300);
  }

  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || !this.service?.address) return;
    
    // Use Geocoding to get coordinates from the address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.service.address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        // Initialize the map centered on the geocoded location
        const map = new google.maps.Map(mapElement, {
          center: location,
          zoom: 14
        });
  
        // Place a marker at the geocoded location
        new google.maps.Marker({
          position: location,
          map: map,
          title: `${this.service.name}'s Location`
        });
      } else {
        // If geocoding fails, show an error
        console.error('Geocoding failed due to: ' + status);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '❌ Failed to find location for the service.',
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
          toast: true
        });
      }
    });
  }
  

  formatLocation(location: string): string {
    // Split address by comma (assuming format "City, Street")
    const parts = location.split(',');

    if (parts.length >= 2) {
      const city = parts[0].trim(); // First part is city
      const street = parts[1].trim(); // Second part is street
      return `Street: ${street}, City: ${city}`;
    } else {
      return location; // If format is unexpected, return it as is
    }
  }
}
