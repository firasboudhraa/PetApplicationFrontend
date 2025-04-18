import { Component } from '@angular/core';
import { AppointmentService } from 'src/app/Services/appointment.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sent-appointment',
  templateUrl: './sent-appointment.component.html',
  styleUrls: ['./sent-appointment.component.css']
})
export class SentAppointmentComponent {
  pendingAppointments: any[] = [];
  confirmedAppointments: any[] = [];
  rejectedAppointments: any[] = [];
  activeTab: string = 'pending';
  idOwner: number = 3;
  reason: string = '';
  combinedPending: { appointment: any; service: any }[] = [];
  combinedConfirmed: { appointment: any; service: any }[] = [];
  combinedRejected: { appointment: any; service: any }[] = [];
  activeRequestId: string | null = null;
  
  constructor(
    private appointmentService: AppointmentService,
    private petService: PetServiceService,
    private mapsLoader: GoogleMapsLoaderService,
  ) {}

  ngOnInit(): void {
    this.mapsLoader.load()
      .then(() => this.fetchAppointments())
      .catch(error => console.error('Error loading Google Maps:', error));
  }

  toggleMenu(requestId: string): void {
    this.activeRequestId = this.activeRequestId === requestId ? null : requestId;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  fetchAppointments(): void {
    this.appointmentService.getAppointmentsByUserId(this.idOwner).subscribe(async (appointments: any[]) => {
      console.log('Appointments:', appointments);

      this.pendingAppointments = [];
      this.confirmedAppointments = [];
      this.rejectedAppointments = [];

      // Step 1: Classify appointments into pending, confirmed, and rejected
      appointments.forEach((appointment: any) => {
        const status = appointment.status?.toLowerCase();

        if (status === 'pending') {
          this.pendingAppointments.push(appointment);
        } else if (status === 'confirmed') {
          this.confirmedAppointments.push(appointment);
        } else if (status === 'cancelled' || status === 'rejected') {
          this.rejectedAppointments.push(appointment);
        }
      });

      // Step 2: Fetch service details for each appointment using idService
      this.combinedPending = await this.fetchServiceDetailsForAppointments(this.pendingAppointments);
      this.combinedConfirmed = await this.fetchServiceDetailsForAppointments(this.confirmedAppointments);
      this.combinedRejected = await this.fetchServiceDetailsForAppointments(this.rejectedAppointments);

      console.log('Combined Pending:', this.combinedPending);
    });
  }

  // Step 3: Fetch service details based on appointment ID
  async fetchServiceDetailsForAppointments(appointments: any[]): Promise<{ appointment: any, service: any }[]> {
    const combined: { appointment: any, service: any }[] = [];

    for (const appointment of appointments) {
      const service = await this.fetchServiceById(appointment.idService);
      combined.push({
        appointment: appointment,
        service: service
      });
    }

    return combined;
  }

  // Step 4: Fetch service by ID using the petService
  fetchServiceById(idService: number): Promise<any> {
    return this.petService.getServiceById(idService).toPromise()
      .then(serviceDetails => serviceDetails)
      .catch(error => {
        console.error('Failed to fetch service details:', error);
        return null;  // Return null if service fetch fails
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
