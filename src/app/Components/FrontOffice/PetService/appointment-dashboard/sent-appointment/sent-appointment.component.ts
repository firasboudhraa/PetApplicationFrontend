import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cs } from '@fullcalendar/core/internal-common';
import { AppointmentService } from 'src/app/Services/appointment.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sent-appointment',
  templateUrl: './sent-appointment.component.html',
  styleUrls: ['./sent-appointment.component.css']
})
export class SentAppointmentComponent implements OnInit {
  pendingAppointments: any[] = [];
  confirmedAppointments: any[] = [];
  rejectedAppointments: any[] = [];
  activeTab: string = 'pending';
  idService: number = 1;
  reason: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private petService: PetServiceService,
    private mapsLoader: GoogleMapsLoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mapsLoader.load()
      .then(() => this.fetchAppointments())
      .catch(error => console.error('Error loading Google Maps:', error));
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  fetchAppointments(): void {
    this.petService.getServiceWithAppointments(this.idService).subscribe(async (service: any) => {
      console.log('Service:', service);
  
      // Convert address if needed
      service.address = await this.mapsLoader.getLocationInLetters(service.address);
  
      const allAppointments = service.appointments || [];
  
      // Normalize status values (in case they are uppercase)
      this.pendingAppointments = allAppointments.filter(
        (appointment: any) => appointment.status?.toLowerCase() === 'pending'
      );
      console.log('Pending Appointments:', this.pendingAppointments);
  
      this.confirmedAppointments = allAppointments.filter(
        (appointment: any) => appointment.status?.toLowerCase() === 'confirmed'
      );
      console.log('Confirmed Appointments:', this.confirmedAppointments);
  
      this.rejectedAppointments = allAppointments.filter(
        (appointment: any) => appointment.status?.toLowerCase() === 'cancelled' || appointment.status?.toLowerCase() === 'rejected'
      );
      console.log('Rejected Appointments:', this.rejectedAppointments);
    });
  }
  
  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Appointment removed successfully.',
        toast: true,
        position: 'top',
        timer: 3000,
        showConfirmButton: false
      });
      this.fetchAppointments();
    }, () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete appointment.',
        toast: true,
        position: 'top',
        timer: 3000,
        showConfirmButton: false
      });
    });
  }

  confirmAppointment(id: number): void {
    this.petService.confirmAppointment(id , this.reason).subscribe(() => {
      Swal.fire('Confirmed!', 'Appointment confirmed successfully.', 'success');
      this.fetchAppointments();
    });
  }

  rejectAppointment(id: number): void {
    this.petService.rejectAppointment(id, this.reason).subscribe(() => {
      Swal.fire('Rejected!', 'Appointment rejected.', 'info');
      this.fetchAppointments();
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/appointment-details'], { queryParams: { id } });
  }
}
