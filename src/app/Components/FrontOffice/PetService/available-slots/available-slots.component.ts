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

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css']
})
export class AvailableSlotsComponent {
  id!:number
  selectedSlot: any = null;  
  
    constructor(private ps: PetServiceService, 
                private Act: ActivatedRoute ,
                private as: AppointmentService
    ) { }
  
    ngOnInit(): void {
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

  
  handleEventClick(arg: any) {
    this.selectedSlot = new Date(arg.event.startStr);
    const formattedDate = this.selectedSlot.toLocaleString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  
    // Sample pets data - Replace with an actual API call if necessary
    const pets = [
      { id: 1, name: 'Bella', image: 'https://t4.ftcdn.net/jpg/01/99/00/79/240_F_199007925_NolyRdRrdYqUAGdVZV38P4WX8pYfBaRP.jpg' },
      { id: 2, name: 'Max', image: 'https://t4.ftcdn.net/jpg/00/85/95/79/240_F_85957993_x6BN46mxasrRye2mp5rXFVrjAUE5LWF8.jpg' },
      { id: 3, name: 'Luna', image: 'https://i.pinimg.com/236x/fc/2c/58/fc2c587ed258bed9d91ecd68928a1c79.jpg' }
    ];
  
    // Construct the pet selection HTML dynamically
    let petOptions = pets.map(pet => {
      return `
        <div class="flex items-center mb-4">
          <input type="radio" id="pet-${pet.id}" name="pet" value="${pet.id}" class="mr-3" />
          <img src="${pet.image}" alt="${pet.name}" class="w-12 h-12 rounded-full border-2 border-gray-300 mr-3" />
          <label for="pet-${pet.id}" class="text-lg font-medium">${pet.name}</label>
        </div>
      `;
    }).join('');
  
    // Add additional fields: reason, idOwner, and idVet
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
          <p><strong>Select your Pet:</strong></p>
          <div class="pets-container">
            ${petOptions}
          </div>
  
          <!-- Add input fields for reason, idOwner, and idVet -->
          <div class="mt-4">
            <label for="reason" class="block text-sm font-medium">Reason</label>
            <input type="text" id="reason" class="swal2-input" placeholder="Enter reason for visit" />
  
            <label for="idOwner" class="block text-sm font-medium mt-4">Owner ID (Static)</label>
            <input type="text" id="idOwner" class="swal2-input" value="12345" readonly />
  
            <label for="idVet" class="block text-sm font-medium mt-4">Vet ID (Static)</label>
            <input type="text" id="idVet" class="swal2-input" value="67890" readonly />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Book it!',
      cancelButtonText: 'No, Cancel',
      preConfirm: () => {
        const selectedPetId = (document.querySelector('input[name="pet"]:checked') as HTMLInputElement)?.value;
        const reason = (document.querySelector('#reason') as HTMLInputElement)?.value;
  
        if (!selectedPetId || !reason) {
          Swal.showValidationMessage('Please select a pet and provide a reason to proceed!');
          return false;
        }
  
        return { selectedPetId, reason }; // Return selected pet ID and reason for further handling
      },
      willClose: () => {
        const selectedPetInput = document.querySelector('input[name="pet"]:checked') as HTMLInputElement | null;
        if (selectedPetInput) {
          selectedPetInput.checked = false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { selectedPetId, reason } = result.value;
  
        const selectedPet = pets.find(pet => pet.id === parseInt(selectedPetId, 10));
  
        if (selectedPet) {
          // Prepare the appointment data to send to the backend
          const appointment = {
            dateAppointment: this.selectedSlot,
            idPet: selectedPet.id,
            idService: this.Act.snapshot.params['id'], // Assuming idService is passed from URL
            status: 'PENDING', // Static status for the appointment
            reason: reason, // Reason from input field
            idOwner: '3', // Static ID for owner
            idVet: '1' // Static ID for vet
          };
  
          // Send to backend (make an API call to create the appointment)
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
  }
  
  
}
