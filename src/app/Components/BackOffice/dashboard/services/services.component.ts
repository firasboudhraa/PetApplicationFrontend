import { Component } from '@angular/core';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services: any[] = [];
  currentPage = 1;
  pageSize = 3;
  totalPages = 0;
  service!: any;
  humanReadableLocation: string = '';
  mapOpened: boolean = false;
  isLoadingMap: boolean = false;

  // Fields for Add/Update service form
  name: string = '';
  description: string = '';
  price: number | undefined;
  durationInMinutes: number | undefined;
  address: string = '';
  startDate: string = '';
  endDate: string = '';
  providerId: number | undefined;

  constructor(private ps: PetServiceService, private mapsLoader: GoogleMapsLoaderService) {}

  ngOnInit(): void {
    this.ps.getServices().subscribe(data => {
      this.services = data;
      this.totalPages = Math.ceil(this.services.length / this.pageSize);
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  initMap(elementId: string = 'map') {
    const mapElement = document.getElementById(elementId);
    if (!mapElement || !this.service?.address) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.service.address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;

        const map = new google.maps.Map(mapElement, {
          center: location,
          zoom: 14
        });

        new google.maps.Marker({
          position: location,
          map: map,
          title: `${this.service.name}'s Location`
        });
      } else {
        console.error('Geocoding failed:', status);
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

  openMap() {
    if (!this.service.address) {
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

    this.mapOpened = true;
    this.isLoadingMap = true;

    this.mapsLoader.load().then(() => {
      Swal.fire({
        title: `${this.service.name}'s Location`,
        html: `<div id="swal-map" style="width: 100%; height: 300px;"></div>`,
        width: 600,
        showConfirmButton: true,
        didOpen: () => {
          this.initMap('swal-map');
        }
      });
      this.isLoadingMap = false;
    }).catch(err => {
      console.error('Google Maps failed to load', err);
      this.isLoadingMap = false;
    });
  }


  // Delete Service
  deleteService(serviceId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.ps.deleteService(serviceId).subscribe(
          () => {
            this.services = this.services.filter(service => service.idService !== serviceId);  // Remove from list
            Swal.fire('Service deleted successfully!', '', 'success');
          },
          error => {
            Swal.fire('Failed to delete service!', 'Please try again.', 'error');
          }
        );
      }
    });
  }

  // This method will be triggered when a service is clicked to view its map location
  serviceClicked(service: any) {
    this.service = service; // Set the clicked service
    this.openMap(); // Open the map modal to show the location
  }
}

