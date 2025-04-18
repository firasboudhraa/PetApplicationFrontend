import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/Services/appointment.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-received-appointment',
  templateUrl: './received-appointment.component.html',
  styleUrls: ['./received-appointment.component.css']
})
export class ReceivedAppointmentComponent {
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
activeRequestId: string | null = null;



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
  // Toggle the FAB menu visibility
  toggleMenu(requestId: string): void {
    this.activeRequestId = this.activeRequestId === requestId ? null : requestId;
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
  
  confirmAppointment(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Confirm the appointment',
      input: 'textarea',
      inputPlaceholder: 'Enter reason (optional)',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: (reason) => {
        return this.petService.confirmAppointment(id, { reason }).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Appointment confirmed',
            text: '✅ Appointment confirmed successfully!',
            position: 'top',
            toast: true,
            timer: 3000
          });
          this.fetchAppointments();
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to confirm appointment.',
            position: 'top',
            toast: true
          });
        });
      },
      position: 'top',
      toast: true
    });
  }
  
  rejectAppointment(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Tell them why you rejected the appointment',
      input: 'textarea',
      inputPlaceholder: 'Enter the reason for rejection',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: (reason) => {
        return this.petService.rejectAppointment(id, { reason }).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Appointment rejected',
            text: '✅ Appointment rejected successfully!',
            position: 'top',
            toast: true,
            timer: 3000
          });
          this.fetchAppointments();
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to reject appointment.',
            position: 'top',
            toast: true
          });
        });
      },
      position: 'top',
      toast: true
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
  

}
