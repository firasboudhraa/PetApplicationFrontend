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
  idProvider: number = 1;
  reason: string = '';
  combinedPending : { appointment: any; service: any }[] = [];
  combinedConfirmed : { appointment: any; service: any }[] = [];
combinedRejected: { appointment: any; service: any }[] = [];
allServices: any[] = [];


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
    this.petService.getServicesWithAppointmentsByProviderId(this.idProvider).subscribe(async (services: any[]) => {
      console.log('Services:', services);
  
      // Save services to use in findServiceByAppointment
      this.allServices = services;
  
      this.pendingAppointments = [];
      this.confirmedAppointments = [];
      this.rejectedAppointments = [];
  
      for (const service of services) {
        // Convert address to string
        service.address = await this.mapsLoader.getLocationInLetters(service.address);
  
        const appointments = service.appointments || [];
  
        this.pendingAppointments.push(
          ...appointments.filter((a: any) => a.status?.toLowerCase() === 'pending')
        );
  
        this.confirmedAppointments.push(
          ...appointments.filter((a: any) => a.status?.toLowerCase() === 'confirmed')
        );
  
        this.rejectedAppointments.push(
          ...appointments.filter((a: any) => {
            const status = a.status?.toLowerCase();
            return status === 'cancelled' || status === 'rejected';
          })
        );
      }
  
      // Now build the combined arrays
      this.combinedPending = this.pendingAppointments.map(app => ({
        appointment: app,
        service: this.findServiceByAppointment(app.idAppointment)
      }));
  
      this.combinedConfirmed = this.confirmedAppointments.map(app => ({
        appointment: app,
        service: this.findServiceByAppointment(app.idAppointment)
      }));
  
      this.combinedRejected = this.rejectedAppointments.map(app => ({
        appointment: app,
        service: this.findServiceByAppointment(app.idAppointment)
      }));
  
      console.log('Combined Pending:', this.combinedPending);
    });

  }
  
  findServiceByAppointment(appointmentId: number): any {
    for (const service of this.allServices) {
      if (service.appointments?.some((a: any) => a.idAppointment === appointmentId)) {
        return service;
      }
    }
    return null;
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
