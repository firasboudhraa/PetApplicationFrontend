import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  services: any[] = [];
  filteredServices: any[] = [];
  paginatedServices: any[] = [];
  currentPage = 1;
  pageSize = 3;
  pageSizeOptions = [3, 6, 9, 12];
  totalPages = 0;
  filterCriteria = '';
  minPrice: number | null = null;
maxPrice: number | null = null;
selectedDuration: string = '';
locationFilter: string = '';


  constructor(private ps: PetServiceService, private router: Router) {}

  ngOnInit(): void {
    this.ps.getServices().subscribe(data => {
      this.services = data;
      this.filteredServices = data;
      this.calculateTotalPages();
      this.updatePaginatedServices();
    });
  }

  filterServices(): void {
    this.filteredServices = this.services.filter(service => {
      const matchesName = this.filterCriteria
        ? service.name.toLowerCase().includes(this.filterCriteria.toLowerCase())
        : true;
  
      const matchesMinPrice = this.minPrice != null ? service.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice != null ? service.price <= this.maxPrice : true;
  
      const matchesDuration =
        this.selectedDuration === 'short' ? service.durationInMinutes < 30 :
        this.selectedDuration === 'medium' ? service.durationInMinutes >= 30 && service.durationInMinutes <= 60 :
        this.selectedDuration === 'long' ? service.durationInMinutes > 60 :
        true;
  
      const matchesLocation = this.locationFilter
        ? service.address?.toLowerCase().includes(this.locationFilter.toLowerCase())
        : true;
  
      return matchesName && matchesMinPrice && matchesMaxPrice && matchesDuration && matchesLocation;
    });
  
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updatePaginatedServices();
  }
  

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredServices.length / this.pageSize);
  }

  updatePaginatedServices(): void {
    this.calculateTotalPages();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedServices = this.filteredServices.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedServices();
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  checkUserBeforeNavigate() {
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.showAccessDeniedAlert("You must be logged in to access this page.");
      return;
    }

    try {
      const user = JSON.parse(userString);
      const hasServiceProviderRole = user.roles.some((role: { name: string }) => role.name === 'SERVICE_PROVIDER');

      if (hasServiceProviderRole) {
        this.router.navigate(['/add-service']);
      } else {
        this.showAccessDeniedAlert("You must be a SERVICE PROVIDER to access this page.");
      }
    } catch {
      this.showAccessDeniedAlert("Invalid user data. Please log in again.");
    }
  }

  showAccessDeniedAlert(message: string) {
    Swal.fire({
      title: '🔒 Access Denied!',
      html: `<div style="font-size: 16px; font-weight: 500; color: #fff;">${message}</div><br>`,
      icon: 'error',
      background: 'linear-gradient(135deg,rgb(128, 149, 137),rgb(207, 230, 208))',
      color: '#ffffff',
      confirmButtonText: '🔑 Login Now',
      showCancelButton: true,
      cancelButtonText: '❌ Maybe Later',
      allowOutsideClick: false,
      showClass: { popup: 'animate__animated animate__zoomIn' },
      hideClass: { popup: 'animate__animated animate__zoomOut' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
}
