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

  // Add Service
  openAddServiceForm() {
    Swal.fire({
      title: 'Add New Service',
      html: `
        <label for="service-name" class="swal2-label">Service Name</label>
        <input id="service-name" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" placeholder="Service Name">
  
        <label for="service-price" class="swal2-label">Price</label>
        <input id="service-price" type="number" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" placeholder="Price">
  
        <label for="service-duration" class="swal2-label">Duration (min)</label>
        <input id="service-duration" type="number" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" placeholder="Duration (min)">
  
        <label for="service-address" class="swal2-label">Address</label>
        <input id="service-address" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" placeholder="Address">
  
        <label for="service-description" class="swal2-label">Description</label>
        <textarea id="service-description" class="swal2-textarea shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" placeholder="Service Description"></textarea>
  
        <label for="service-startDate" class="swal2-label">Start Date</label>
        <input id="service-startDate" type="datetime-local" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">
  
        <label for="service-endDate" class="swal2-label">End Date</label>
        <input id="service-endDate" type="datetime-local" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">
      `,
      confirmButtonText: 'Add Service',
      width: '70%', // Set width to 70% for a balanced medium size
      customClass: {
        popup: 'add-edit-popup', // Custom class to control width
      },
      preConfirm: () => {
        const name = (document.getElementById('service-name') as HTMLInputElement).value;
        const price = +(document.getElementById('service-price') as HTMLInputElement).value;
        const duration = +(document.getElementById('service-duration') as HTMLInputElement).value;
        const address = (document.getElementById('service-address') as HTMLInputElement).value;
        const description = (document.getElementById('service-description') as HTMLTextAreaElement).value;
        const startDate = (document.getElementById('service-startDate') as HTMLInputElement).value;
        const endDate = (document.getElementById('service-endDate') as HTMLInputElement).value;
  
        if (!name || !price || !duration || !address || !description || !startDate || !endDate) {
          Swal.showValidationMessage('All fields are required');
          return;
        }
  
        return { name, price, duration, address, description, startDate, endDate };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const newService = result.value;
        this.ps.addService(newService).subscribe(
          data => {
            this.services.push(data);  // Add the new service to the list
            this.totalPages = Math.ceil(this.services.length / this.pageSize);
            Swal.fire('Service added successfully!', '', 'success');
          },
          error => {
            Swal.fire('Failed to add service!', 'Please try again.', 'error');
          }
        );
      }
    });
  }
  
  openEditServiceForm(service: any) {
    Swal.fire({
      title: `Edit Service: ${service.name}`,
      html: `
        <label for="service-name" class="swal2-label">Service Name</label>
        <input id="service-name" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" value="${service.name}">
  
        <label for="service-price" class="swal2-label">Price</label>
        <input id="service-price" type="number" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" value="${service.price}">
  
        <label for="service-duration" class="swal2-label">Duration (min)</label>
        <input id="service-duration" type="number" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" value="${service.durationInMinutes}">
  
        <label for="service-description" class="swal2-label">Description</label>
        <textarea id="service-description" class="swal2-textarea shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200">${service.description}</textarea>
  
        <label for="service-address" class="swal2-label">Address</label>
        <input id="service-address" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" value="${service.address}">
  
        <label for="service-startDate" class="swal2-label">Start Date</label>
        <input id="service-startDate" type="datetime-local" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" value="${service.startDate}">
  
        <label for="service-endDate" class="swal2-label">End Date</label>
        <input id="service-endDate" type="datetime-local" class="swal2-input shadow-md border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200" value="${service.endDate}">
      `,
      confirmButtonText: 'Update Service',
      width: '70%', // Set width to 70% for a balanced medium size
      customClass: {
        popup: 'add-edit-popup', // Custom class to control width
      },
      preConfirm: () => {
        const name = (document.getElementById('service-name') as HTMLInputElement).value;
        const price = +(document.getElementById('service-price') as HTMLInputElement).value;
        const duration = +(document.getElementById('service-duration') as HTMLInputElement).value;
        const address = (document.getElementById('service-address') as HTMLInputElement).value;
        const description = (document.getElementById('service-description') as HTMLTextAreaElement).value;
        const startDate = (document.getElementById('service-startDate') as HTMLInputElement).value;
        const endDate = (document.getElementById('service-endDate') as HTMLInputElement).value;
  
        if (!name || !price || !duration || !address || !description || !startDate || !endDate) {
          Swal.showValidationMessage('All fields are required');
          return;
        }
  
        return { idService: service.idService, name, price, duration, address, description, startDate, endDate };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const updatedService = result.value;
        this.ps.updateService( updatedService.idService,updatedService).subscribe(
          data => {
            const index = this.services.findIndex(s => s.idService === updatedService.idService);
            if (index !== -1) {
              this.services[index] = data;  // Update the service in the list
            }
            this.totalPages = Math.ceil(this.services.length / this.pageSize);
            Swal.fire('Service updated successfully!', '', 'success');
          },
          error => {
            Swal.fire('Failed to update service!', 'Please try again.', 'error');
          }
        );
      }
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

