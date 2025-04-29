import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/Services/appointment.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/auth.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import { Pet } from 'src/app/models/pet';

@Component({
  selector: 'app-appointments-profile-user',
  templateUrl: './appointments-profile-user.component.html',
  styleUrls: ['./appointments-profile-user.component.css'],
})
export class AppointmentsProfileUserComponent implements OnInit, OnDestroy {
  pendingAppointments: any[] = [];
  confirmedAppointments: any[] = [];
  rejectedAppointments: any[] = [];
  activeTab: string = 'pending';
  idOwner!: number;
  reason: string = '';
  combinedPending: { appointment: any; service: any }[] = [];
  combinedConfirmed: { appointment: any; service: any }[] = [];
  combinedRejected: { appointment: any; service: any }[] = [];
  activeRequestId: string | null = null;
  remainingTimes: { [id: number]: string } = {};
  intervalRef: any;
  userId: number | null = null;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';

  constructor(
    private appointmentService: AppointmentService,
    private petService: PetServiceService,
    private mapsLoader: GoogleMapsLoaderService,
    private authService: AuthService,
    private petDataService: PetdataServiceService
  ) {}

  ngOnInit(): void {
    this.mapsLoader
      .load()
      .then(() => {
        this.fetchAppointments();
        this.startCountdown();
      })
      .catch((error) => console.error('Error loading Google Maps:', error));
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  startCountdown(): void {
    this.intervalRef = setInterval(() => {
      this.combinedConfirmed.forEach((item) => {
        const appointmentDate = new Date(
          item.appointment.dateAppointment
        ).getTime();
        const now = new Date().getTime();
        const diff = appointmentDate - now;

        if (diff <= 0) {
          this.remainingTimes[item.appointment.idAppointment] = 'Started';
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          this.remainingTimes[
            item.appointment.idAppointment
          ] = `${hours}h ${minutes}m ${seconds}s`;
        }
      });
    }, 1000);
  }

  toggleMenu(requestId: string): void {
    this.activeRequestId =
      this.activeRequestId === requestId ? null : requestId;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }

  fetchAppointments(): void {
    const userId = this.authService.getDecodedToken()?.userId;
    if (userId !== undefined) {
      this.idOwner = userId;
    } else {
      console.error('User ID is undefined');
    }

    this.appointmentService
      .getAppointmentsByUserId(this.idOwner)
      .subscribe(async (appointments: any[]) => {
        this.pendingAppointments = [];
        this.confirmedAppointments = [];
        this.rejectedAppointments = [];

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

        this.combinedPending = await this.fetchServiceDetailsForAppointments(
          this.pendingAppointments
        );
        this.combinedConfirmed = await this.fetchServiceDetailsForAppointments(
          this.confirmedAppointments
        );
        this.combinedRejected = await this.fetchServiceDetailsForAppointments(
          this.rejectedAppointments
        );
      });
  }

  async fetchServiceDetailsForAppointments(
    appointments: any[]
  ): Promise<{ appointment: any; service: any }[]> {
    const combined: { appointment: any; service: any }[] = [];

    for (const appointment of appointments) {
      const service = await this.fetchServiceById(appointment.idService);
      combined.push({
        appointment: appointment,
        service: service,
      });
    }

    return combined;
  }

  fetchServiceById(idService: number): Promise<any> {
    return this.petService
      .getServiceById(idService)
      .toPromise()
      .then((serviceDetails) => serviceDetails)
      .catch((error) => {
        console.error('Failed to fetch service details:', error);
        return null;
      });
  }

  updateAppointment(item: any): void {
    this.petService.getServiceById(item.appointment.idService).subscribe((service) => {
      const serviceName = service.name;
      this.userId = this.authService.getDecodedToken()?.userId ?? 0;
  
      this.petDataService.getPetsByOwnerId(this.userId).subscribe((pets: Pet[]) => {
        if (!pets.length) {
          Swal.fire(
            'No Pets Found',
            'Please add a pet before editing the appointment.',
            'info'
          );
          return;
        }
  
        const formattedDate = new Date(item.appointment.dateAppointment)
          .toISOString()
          .slice(0, 16);
  
        const petOptions = pets.map((pet) => `
          <div class="pet-option"
               style="display: flex; align-items: center; padding: 10px 12px; cursor: pointer;
                      border-bottom: 1px solid #f0f0f0; transition: background-color 0.2s ease;"
               data-pet-id="${pet.id}" data-pet-name="${pet.name}">
            <img src="${this.getImageUrl(pet.imagePath)}" alt="${pet.name}"
                 style="width: 45px; height: 45px; border-radius: 50%; margin-right: 12px; object-fit: cover;" />
            <span style="font-weight: 500; font-size: 16px;">${pet.name}</span>
          </div>
        `).join('');
  
        Swal.fire({
          title: 'Edit Appointment',
          html: `
            <div style="margin-bottom: 16px;">
              <label for="swal-date" style="font-weight: 600;">Date:</label>
              <input id="swal-date" type="datetime-local" value="${formattedDate}"
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ccc;" />
            </div>
  
            <div style="margin-bottom: 16px;">
              <label for="swal-reason" style="font-weight: 600;">Reason:</label>
              <input id="swal-reason" placeholder="Reason" value="${item.appointment.reason || ''}"
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ccc;" />
            </div>
  
            <div style="margin-bottom: 16px;">
              <label for="selectedPetInput" style="font-weight: 600;">Select Pet</label>
              <div style="position: relative;">
                <input id="selectedPetInput" class="swal2-input" placeholder="Click to select a pet" readonly
                  style="background-color: #f9f9f9; cursor: pointer; font-weight: 500;" />
                <input type="hidden" id="selectedPetId" />
                <div id="petDropdown" style="
                    display: none; max-height: 250px; overflow-y: auto;
                    border: 1px solid #ddd; border-radius: 8px; margin-top: 5px;
                    background: #fff; position: absolute; width: 100%;
                    z-index: 1000; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                  ${petOptions}
                </div>
              </div>
            </div>
  
            <div style="margin-bottom: 16px;">
              <label for="swal-service" style="font-weight: 600;">Service:</label>
              <input id="swal-service" value="${serviceName}" readonly
                style="width: 100%; padding: 10px; border-radius: 8px;
                       border: 1px solid #e0e0e0; background-color: #f0f0f0; font-weight: 500;" />
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Update',
          didOpen: () => {
            const input = document.getElementById('selectedPetInput') as HTMLInputElement;
            const dropdown = document.getElementById('petDropdown');
            const hiddenInput = document.getElementById('selectedPetId') as HTMLInputElement;
  
            if (input && dropdown) {
              input.addEventListener('click', () => {
                dropdown!.style.display = dropdown!.style.display === 'block' ? 'none' : 'block';
              });
  
              dropdown!.querySelectorAll('.pet-option').forEach((option) => {
                option.addEventListener('click', () => {
                  const petId = option.getAttribute('data-pet-id');
                  const petName = option.getAttribute('data-pet-name');
                  input.value = petName || '';
                  hiddenInput.value = petId || '';
                  dropdown!.style.display = 'none';
                });
              });
            }
          },
          preConfirm: () => {
            const date = (document.getElementById('swal-date') as HTMLInputElement).value;
            const reason = (document.getElementById('swal-reason') as HTMLInputElement).value;
            const idPet = +(document.getElementById('selectedPetId') as HTMLInputElement).value;
  
            if (!date || !reason || !idPet) {
              Swal.showValidationMessage('Please fill in all fields.');
              return;
            }
  
            return {
              date,
              reason,
              idVet: item.appointment.idVet,
              idPet,
              idOwner: item.appointment.idOwner,
              idService: item.appointment.idService,
            };
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const updatedAppointment = {
              dateAppointment: result.value.date,
              reason: result.value.reason,
              idVet: result.value.idVet,
              idPet: result.value.idPet,
              idOwner: result.value.idOwner,
              idService: result.value.idService,
            };
  
            const id = item.appointment.idAppointment;
  
            this.appointmentService.updateAppoitnment(id, updatedAppointment).subscribe(
              () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Updated!',
                  text: 'Appointment updated successfully.',
                  timer: 4000,
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                });
                this.fetchAppointments();
              },
              () => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to update appointment.',
                });
              }
            );
          }
        });
      });
    });
  }
  

  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Appointment deleted successfully.',
        timer: 3000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
      this.fetchAppointments();
    });
  }
}
