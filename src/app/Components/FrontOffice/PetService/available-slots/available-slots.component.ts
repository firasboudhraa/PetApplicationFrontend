import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import listPlugin from '@fullcalendar/list'; 
import { CalendarOptions } from '@fullcalendar/core';
import  { ActivatedRoute, Router } from '@angular/router';
import  { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';
import  { AppointmentService } from 'src/app/Services/appointment.service';
import  { AuthService, UserPayload } from 'src/app/Services/auth-service.service';

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css']
})
export class AvailableSlotsComponent {
  id!:number
  selectedSlot: any = null;  
  userId: number | null = null ; 
  user: UserPayload | null = null;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';
  
    constructor(private ps: PetServiceService, 
                private Act: ActivatedRoute ,
                private as: AppointmentService,
                private authService: AuthService
    ) { }
  
    ngOnInit(): void {
      this.user = this.authService.getUserFromToken();
      this.id = this.Act.snapshot.params['id'];
        this.ps.getAvailableSlots(this.id).subscribe((data) => {
          const events = data.map((slot: any) => {  
  
            return {
              title: `Book Here`,
              start: slot,    
              backgroundColor: '#4CAF50',
              extendedProps: {
                idService: this.id 
              }
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
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventMouseEnter: (info) => {
      Swal.fire({
        title: "🔥 Wanna Book?",
        text: "Click me to reserve  before I gone!",
        icon: "info",
        showConfirmButton: false,
        timer: 1000,
        toast: true, 
        position: "center",
        customClass: {
          popup: 'custom-swal-position'
        }
      });
    }
  };

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }
  
  handleEventClick(arg: any) {
   /* this.selectedSlot = new Date(arg.event.startStr);
    const formattedDate = this.selectedSlot.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
    // Fetch pets dynamically using the userId
    this.petDataService.getPetsByOwnerId(this.userId).subscribe((pets: Pet[]) => {
      if (!pets.length) {
        Swal.fire('No Pets Found', 'Please add a pet before booking an appointment.', 'info');
        return;
      }
  
      // Build dropdown items dynamically
      let petOptions = pets.map((pet, index) => `
        <li onclick="document.getElementById('selectedPetName').textContent='${pet.name}';document.getElementById('selectedPetId').value='${pet.id}'">
          <a class="dropdown-item d-flex align-items-center" href="#">
            <img src="${this.getImageUrl(pet.imagePath)}" alt="${pet.name}" class="pet-image me-2" />
            <span class="pet-name">${pet.name}</span>
          </a>
        </li>
      `).join('');
  
      Swal.fire({
        title: 'Book Appointment',
        icon: 'info',
        input: 'text',
        inputValue: formattedDate,
        inputAttributes: {
          readonly: 'true'
        },
        html: `
          <div>
            <label for="petDropdown">Select Your Pet:</label>
            <div class="dropdown mb-3">
              <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span id="selectedPetName">Select a Pet</span>
              </button>
              <ul class="dropdown-menu">${petOptions}</ul>
              <input type="hidden" id="selectedPetId" />
            </div>
  
            <label for="reason" class="block text-sm font-medium">Reason</label>
            <input type="text" id="reason" class="swal2-input" placeholder="Enter reason for visit" />
  
            <label for="idOwner" class="block text-sm font-medium mt-4">Owner ID</label>
            <input type="text" id="idOwner" class="swal2-input" value="${this.userId}" readonly />
  
            <label for="idVet" class="block text-sm font-medium mt-4">Vet ID</label>
            <input type="text" id="idVet" class="swal2-input" value="1" readonly />
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Yes, Book it!',
        cancelButtonText: 'No, Cancel',
        preConfirm: () => {
          const selectedPetId = (document.getElementById('selectedPetId') as HTMLInputElement)?.value;
          const reason = (document.getElementById('reason') as HTMLInputElement)?.value;
  
          if (!selectedPetId || !reason) {
            Swal.showValidationMessage('Please select a pet and provide a reason to proceed!');
            return false;
          }
  
          return { selectedPetId, reason };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { selectedPetId, reason } = result.value;
          const selectedPet = pets.find(p => p.id === parseInt(selectedPetId, 10));
  
          if (selectedPet) {
            const appointment = {
              dateAppointment: this.selectedSlot,
              idPet: selectedPet.id,
              idService: this.Act.snapshot.params['id'],
              status: 'PENDING',
              reason: reason,
              idOwner: this.userId,
              idVet: 1
            };
  
            this.as.createAppointment(appointment).subscribe(
              response => {
                Swal.fire(
                  'Appointment Booked!',
                  `Your appointment with ${selectedPet.name} has been successfully scheduled!`,
                  'success'
                );
              },
              error => {
                Swal.fire('Error', 'There was an issue booking the appointment.', 'error');
              }
            );
          } else {
            Swal.fire('Error', 'There was an issue booking the appointment.', 'error');
          }
        }
      });
    });*/
  }
  
  
  
}
