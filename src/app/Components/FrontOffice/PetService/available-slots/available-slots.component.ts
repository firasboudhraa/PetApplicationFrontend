import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions } from '@fullcalendar/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';
import { AppointmentService } from 'src/app/Services/appointment.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import { AuthService } from '../../user/auth/auth.service';
import type { Pet } from 'src/app/models/pet';

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css'],
})
export class AvailableSlotsComponent {
  id!: number;
  selectedSlot: any = null;
  userId: number | null = null;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';

  constructor(
    private ps: PetServiceService,
    private Act: ActivatedRoute,
    private as: AppointmentService,
    private authService: AuthService,
    private petDataService: PetdataServiceService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getDecodedToken()?.userId ?? 0;
    this.id = this.Act.snapshot.params['id'];
    this.ps.getAvailableSlots(this.id).subscribe((data) => {
      const events = data.map((slot: any) => {
        return {
          title: `Book Here`,
          start: slot,
          backgroundColor: '#4CAF50',
          extendedProps: {
            idService: this.id,
          },
        };
      });
      this.calendarOptions.events = events;
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'timeGrid',
    selectable: true,
    editable: true,
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventMouseEnter: (info) => {
      Swal.fire({
        title: '🔥 Wanna Book?',
        text: 'Click me to reserve  before I gone!',
        icon: 'info',
        showConfirmButton: false,
        timer: 1000,
        toast: true,
        position: 'center',
        customClass: {
          popup: 'custom-swal-position',
        },
      });
    },
  };

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }

  handleEventClick(arg: any) {
    this.selectedSlot = new Date(arg.event.startStr);
    const formattedDate = this.selectedSlot.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    this.userId = this.authService.getDecodedToken()?.userId ?? 0;

    this.petDataService
      .getPetsByOwnerId(this.userId)
      .subscribe((pets: Pet[]) => {
        if (!pets.length) {
          Swal.fire(
            'No Pets Found',
            'Please add a pet before booking an appointment.',
            'info'
          );
          return;
        }

        let petOptions = pets
          .map(
            (pet, index) => `
        <div class="pet-option" 
             style="display: flex; align-items: center; padding: 8px; cursor: pointer; border-bottom: 1px solid #eee;"
             data-pet-id="${pet.id}" data-pet-name="${pet.name}">
          <img src="${this.getImageUrl(pet.imagePath)}" alt="${pet.name}" 
               style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
          <span>${pet.name}</span>
        </div>
      `
          )
          .join('');

        Swal.fire({
          title: 'Book Appointment',
          html: `
            <div style="text-align: left; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              
              <!-- Appointment Date -->
              <div style="margin-bottom: 20px;">
                <label for="date" class="swal2-label" style="font-weight: 600; margin-bottom: 5px; display: block;">Appointment Date</label>
                <input id="date" class="swal2-input" value="${formattedDate}" readonly style="background-color: #f9f9f9; font-weight: 500;" />
              </div>

              <!-- Select Pet -->
              <div style="margin-bottom: 20px;">
                <label for="selectedPetInput" class="swal2-label" style="font-weight: 600; margin-bottom: 5px; display: block;">Select Pet</label>
                <div style="position: relative;">
                  <input id="selectedPetInput" class="swal2-input" placeholder="Click to select a pet" readonly 
                        style="background-color: #f9f9f9; cursor: pointer; font-weight: 500;" />
                  <input type="hidden" id="selectedPetId" />
                  <div id="petDropdown" style="
                      display: none; 
                      max-height: 250px; 
                      overflow-y: auto; 
                      border: 1px solid #ddd; 
                      border-radius: 8px; 
                      margin-top: 5px; 
                      background: #ffffff; 
                      position: absolute; 
                      width: 100%; 
                      z-index: 1000;
                      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                      transition: all 0.3s ease;
                    ">
                    ${pets.map((pet, index) => `
                      <div class="pet-option" 
                          style="
                            display: flex; 
                            align-items: center; 
                            padding: 10px 12px; 
                            cursor: pointer; 
                            border-bottom: 1px solid #f0f0f0;
                            transition: background-color 0.2s ease;
                          " 
                          data-pet-id="${pet.id}" data-pet-name="${pet.name}">
                        <img src="${this.getImageUrl(pet.imagePath)}" alt="${pet.name}" 
                            style="width: 45px; height: 45px; border-radius: 50%; margin-right: 12px; object-fit: cover;">
                        <span style="font-weight: 500; font-size: 16px;">${pet.name}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Reason for Appointment -->
              <div>
                <label for="reason" class="swal2-label" style="font-weight: 600; margin-bottom: 5px; display: block;">Reason for Appointment</label>
                <input type="text" id="reason" class="swal2-input" placeholder="Enter reason" style="background-color: #f9f9f9; font-weight: 500;" />
              </div>

            </div>
          `
          ,

          showCancelButton: true,
          confirmButtonText: 'Yes, Book it!',
          cancelButtonText: 'No, Cancel',
          didOpen: () => {
            const selectedPetInput = (
              Swal.getPopup() as HTMLElement
            ).querySelector('#selectedPetInput') as HTMLInputElement;
            const petDropdown = (Swal.getPopup() as HTMLElement).querySelector(
              '#petDropdown'
            ) as HTMLElement;
            const petOptions = (
              Swal.getPopup() as HTMLElement
            ).querySelectorAll('.pet-option');

            // When click on input ➔ toggle list
            selectedPetInput.addEventListener('click', () => {
              petDropdown.style.display =
                petDropdown.style.display === 'block' ? 'none' : 'block';
            });

            // When click on pet ➔ fill input
            petOptions.forEach((option) => {
              option.addEventListener('click', () => {
                const petName = option.getAttribute('data-pet-name');
                const petId = option.getAttribute('data-pet-id');
                selectedPetInput.value = petName!;
                ((Swal.getPopup() as HTMLElement).querySelector(
                  '#selectedPetId'
                ) as HTMLInputElement)!.value = petId!;
                petDropdown.style.display = 'none'; // hide dropdown
              });
            });
          },
          preConfirm: () => {
            const selectedPetId = (
              document.getElementById('selectedPetId') as HTMLInputElement
            )?.value;
            const reason = (
              document.getElementById('reason') as HTMLInputElement
            )?.value;

            if (!selectedPetId || !reason) {
              Swal.showValidationMessage(
                'Please select a pet and provide a reason!'
              );
              return false;
            }

            return { selectedPetId, reason };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { selectedPetId, reason } = result.value;
            const selectedPet = pets.find(
              (p) => p.id === parseInt(selectedPetId, 10)
            );

            if (selectedPet) {
              const appointment = {
                dateAppointment: this.selectedSlot,
                idPet: selectedPet.id,
                idService: this.Act.snapshot.params['id'],
                status: 'PENDING',
                reason: reason,
                idOwner: this.userId,
                idVet: 1,
              };

              this.as.createAppointment(appointment).subscribe(
                (response) => {
                  Swal.fire(
                    'Appointment Booked!',
                    `Your appointment with ${selectedPet.name} has been successfully scheduled!`,
                    'success'
                  );
                },
                (error) => {
                  Swal.fire(
                    'Error',
                    'There was an issue booking the appointment.',
                    'error'
                  );
                }
              );
            } else {
              Swal.fire(
                'Error',
                'There was an issue booking the appointment.',
                'error'
              );
            }
          }
        });
      });
  }
}
