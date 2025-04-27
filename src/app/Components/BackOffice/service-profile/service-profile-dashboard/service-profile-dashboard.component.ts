import { Component } from '@angular/core';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-service-profile-dashboard',
  templateUrl: './service-profile-dashboard.component.html',
  styleUrls: ['./service-profile-dashboard.component.css']
})
export class ServiceProfileDashboardComponent {
  services: any[] = [];
  displayedServices: any[] = [];
  itemsToShow: number = 6; // Start with 6
  userId!: number;

  constructor(private petService: PetServiceService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getDecodedToken()?.userId ?? 0;

    if (this.userId) {
      this.petService.getServicesWithAppointmentsByProviderId(this.userId).subscribe((data) => {
        this.services = data;
        console.log("services:", this.services)
        this.updateDisplayedServices();
      });
    }
  }

  showMore() {
    this.itemsToShow += 3;
    this.updateDisplayedServices();
  }

  showLess() {
    this.itemsToShow = 6;
    this.updateDisplayedServices();
  }

  updateDisplayedServices() {
    this.displayedServices = this.services.slice(0, this.itemsToShow);
  }

  flipCard(service: any) {
    service.isFlipped = true; // flip the card
  
    setTimeout(() => {
      service.isFlipped = false; // flip it back after 6 seconds
    }, 3000); // 6000 ms = 6 seconds
  }


  onDeleteService(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.petService.deleteService(id).subscribe({
          next: () => {
            // Remove the deleted service from the list
            this.services = this.services.filter(service => service.id !== id);
            this.updateDisplayedServices(); // Refresh the displayed list
  
            Swal.fire(
              'Deleted!',
              'The service has been deleted.',
              'success'
            );
          },
          error: (err) => {
            Swal.fire(
              'Error!',
              'Something went wrong. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }
  
  
}
