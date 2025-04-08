import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-service',
  templateUrl: './detail-service.component.html',
  styleUrls: ['./detail-service.component.css']
})
export class DetailServiceComponent {
  id!: number;
  service!: any;
  availableSlots: string[] = [];
  humanReadableLocation: string = '';
  mapOpened: boolean = false;
  isLoadingMap: boolean = false;
  
  constructor(private ps: PetServiceService, 
              private Act: ActivatedRoute , 
              private router: Router,
              private mapsLoader:GoogleMapsLoaderService) { }

  ngOnInit(): void {
    this.id = this.Act.snapshot.params['id'];    
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

  getAvailableSlots(): void {
    this.ps.getAvailableSlots(this.id).subscribe(
      (data) => {
        this.availableSlots = data;
        console.log(this.availableSlots);
      }
    );
  }
  bookAppointment(serviceId : number) {
    const user = localStorage.getItem('user');

    if (user) {
      this.router.navigate(['/appointment', serviceId]);
    } else {
      Swal.fire({
        title: '🔒 Access Restricted!',
        html: `
          <div style="font-size: 16px; font-weight: 500; color: #fff;">
            You must be logged in to access this page.
          </div>
          <br>
        `,
        icon: 'warning',
        position: 'center',
        background: 'linear-gradient(135deg, #00c853, #1b5e20)',  
        color: '#ffffff',
        confirmButtonText: '🔑 Login Now',
        showCancelButton: true,
        cancelButtonText: '❌ Maybe Later',
        customClass: {
          popup: 'swal2-border-radius', 
          confirmButton: 'swal2-confirm-button',
          cancelButton: 'swal2-cancel-button'
        },
        allowOutsideClick: false,
        showClass: {
          popup: 'animate__animated animate__zoomIn'  
        },
        hideClass: {
          popup: 'animate__animated animate__zoomOut'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  deleteService(id :number){
    this.ps.deleteService(id).subscribe(
      ()=> this.ngOnInit()
    )
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
