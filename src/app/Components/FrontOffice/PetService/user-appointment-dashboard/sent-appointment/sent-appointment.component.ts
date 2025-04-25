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
  remainingTimes: { [id: number]: string } = {};
 intervalRef: any;
  
  constructor(
    private appointmentService: AppointmentService,
    private petService: PetServiceService,
    private mapsLoader: GoogleMapsLoaderService,
  ) {}

  ngOnInit(): void {
    this.mapsLoader.load()
      .then(() =>{ 
        this.fetchAppointments();
      this.startCountdown();
     })
      .catch(error => console.error('Error loading Google Maps:', error));
  }

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

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
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

  updateAppointment(item: any): void {
    // Fetch the service name based on idService before opening Swal
    this.petService.getServiceById(item.appointment.idService).subscribe(service => {
      const serviceName = service.name; // The name of the service
  
      Swal.fire({
        title: 'Edit Appointment',
        html: `
          <div class="swal2-input-container mb-4">
            <label for="swal-date" class="text-gray-700 font-medium">Date:</label>
            <input id="swal-date" class="swal2-input border-2 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              type="datetime-local" value="${new Date(item.appointment.dateAppointment).toISOString().slice(0, 16)}">
          </div>
  
          <div class="swal2-input-container mb-4">
            <label for="swal-reason" class="text-gray-700 font-medium">Reason:</label>
            <input id="swal-reason" class="swal2-input border-2 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              value="${item.appointment.reason || ''}" placeholder="Reason">
          </div>
  
          <div class="swal2-input-container mb-4">
            <label for="swal-idPet" class="text-gray-700 font-medium">Pet ID:</label>
            <input id="swal-idPet" class="swal2-input border-2 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              type="number" value="${item.appointment.idPet}">
          </div>
  
          <div class="swal2-input-container mb-4">
            <label for="swal-service" class="text-gray-700 font-medium">Service:</label>
            <input id="swal-service" class="swal2-input border-2 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              value="${serviceName}" readonly>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        focusConfirm: false,
        preConfirm: () => {
          const date = (document.getElementById('swal-date') as HTMLInputElement).value;
          const reason = (document.getElementById('swal-reason') as HTMLInputElement).value;
          const idPet = +(document.getElementById('swal-idPet') as HTMLInputElement).value;
  
          if (!date || !reason ||  !idPet ) {
            Swal.showValidationMessage('Please fill in all fields');
            return;
          }
  
          return { 
            date,
            reason,
            idVet: item.appointment.idVet,
            idPet,
            idOwner: item.appointment.idOwner,
            idService: item.appointment.idService
            };
        }
      }).then(result => {
        if (result.isConfirmed && result.value) {
          const updatedAppointment = {
            dateAppointment: result.value.date,
            reason: result.value.reason,
            idVet: result.value.idVet,
            idPet: result.value.idPet,
            idOwner: result.value.idOwner,
            idService: item.appointment.idService // Maintain the original service ID
          };
  
          const id = item.appointment.idAppointment;
  
          this.appointmentService.updateAppoitnment(id, updatedAppointment)
            .subscribe(() => {
              Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Appointment updated successfully.',
                timer: 4000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
              });
              this.fetchAppointments(); // Refresh the list
            }, error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update appointment.'
              });
            });
        }
      });
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
