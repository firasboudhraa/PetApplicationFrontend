import { Component, OnInit, OnDestroy } from '@angular/core';
import  { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';
import { AppointmentService } from 'src/app/Services/appointment.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointments-profile',
  templateUrl: './appointments-profile.component.html',
  styleUrls: ['./appointments-profile.component.css']
})
export class AppointmentsProfileComponent implements OnInit, OnDestroy {
  pendingAppointments: any[] = [];
  confirmedAppointments: any[] = [];
  rejectedAppointments: any[] = [];
  activeTab: string = 'pending';
  idProvider!: number;
  combinedPending: { appointment: any; service: any }[] = [];
  combinedConfirmed: { appointment: any; service: any }[] = [];
  combinedRejected: { appointment: any; service: any }[] = [];
  allServices: any[] = [];
  activeRequestId: string | null = null;
  remainingTimes: { [id: number]: string } = {};
  intervalRef: any;

  constructor(
    private appointmentService: AppointmentService,
    private petService: PetServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchAppointments();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  // Start the countdown for confirmed appointments
  startCountdown(): void {
    this.intervalRef = setInterval(() => {
      this.combinedConfirmed.forEach(item => {
        const appointmentDate = new Date(item.appointment.dateAppointment).getTime();
        const now = new Date().getTime();
        const diff = appointmentDate - now;

        if (diff <= 0) {
          this.remainingTimes[item.appointment.idAppointment] = 'Started';
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          this.remainingTimes[item.appointment.idAppointment] =
            `${hours}h ${minutes}m ${seconds}s`;
        }
      });
    }, 1000);
  }

  fetchAppointments(): void {
    const userId = this.authService.getDecodedToken()?.userId;
    if (userId !== undefined) {
      this.idProvider = userId;
    } else {
      console.error('User ID is undefined');
    }

    this.petService.getServicesWithAppointmentsByProviderId(this.idProvider).subscribe(services => {
      this.allServices = services;

      this.pendingAppointments = [];
      this.confirmedAppointments = [];
      this.rejectedAppointments = [];

      services.forEach(service => {
        const appointments: { idAppointment: number; status?: string }[] = service.appointments || [];
        this.pendingAppointments.push(...appointments.filter((a: { status?: string }) => a.status?.toLowerCase() === 'pending'));
        this.confirmedAppointments.push(...appointments.filter((a: { status?: string }) => a.status?.toLowerCase() === 'confirmed'));
        this.rejectedAppointments.push(...appointments.filter((a: { status?: string }) => a.status?.toLowerCase() === 'rejected' || a.status?.toLowerCase() === 'cancelled'));
      });

      this.combineAppointments();
    });
  }

  combineAppointments(): void {
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
  }

  findServiceByAppointment(appointmentId: number): any {
    for (const service of this.allServices) {
      if (service.appointments?.some((a: { idAppointment: number }) => a.idAppointment === appointmentId)) {
        return service;
      }
    }
    return null;
  }
  // Toggle the FAB menu visibility
  toggleMenu(requestId: string): void {
    this.activeRequestId = this.activeRequestId === requestId ? null : requestId;
  }

  // Confirmation and rejection logic
  confirmAppointment(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Confirm the appointment',
      input: 'textarea',
      inputPlaceholder: 'Enter reason (optional)',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
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
      }
    });
  }

  rejectAppointment(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Reject the appointment',
      input: 'textarea',
      inputPlaceholder: 'Enter reason for rejection',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      preConfirm: (reason) => {
        return this.petService.rejectAppointment(id, { reason }).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Appointment rejected',
            text: '❌ Appointment rejected successfully!',
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
      }
    });
  }

  // Tab handling
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
