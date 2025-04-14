import { Component } from '@angular/core';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
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
  constructor(private ps: PetServiceService, private mapsLoader:GoogleMapsLoaderService) {}

  ngOnInit(): void {
    this.ps.getServices().subscribe(data => {
      this.services = data;
      this.totalPages = Math.ceil(this.services.length / this.pageSize);
      if (this.service.address) {
        this.humanReadableLocation = this.formatLocation(this.service.address);
      }
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
    
      // Load the map script and show Swal once it's ready
      this.mapsLoader.load().then(() => {
        // Wait for the DOM to be ready inside Swal
        Swal.fire({
          title: `${this.service.name}'s Location`,
          html: `<div id="swal-map" style="width: 100%; height: 300px;"></div>`,
          width: 600,
          showConfirmButton: true,
          didOpen: () => {
            this.initMap('swal-map');  // Initialize map in the custom swal-map div
          }
        });
        this.isLoadingMap = false;
      }).catch(err => {
        console.error('Google Maps failed to load', err);
        this.isLoadingMap = false;
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

      serviceClicked(service: any): void {
        this.service = service;
        this.openMap();
      }
      

}
