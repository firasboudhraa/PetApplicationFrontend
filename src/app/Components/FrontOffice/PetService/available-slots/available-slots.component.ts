import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import listPlugin from '@fullcalendar/list'; 
import { CalendarOptions } from '@fullcalendar/core';
import  { ActivatedRoute, Router } from '@angular/router';
import  { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css']
})
export class AvailableSlotsComponent {
  id!:number
  selectedSlot: any = null;  
    constructor(private ps: PetServiceService, private Act: ActivatedRoute ) { }
  
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
      { id: 1, name: 'Bella', image: 'https://example.com/pets/bella.jpg' },
      { id: 2, name: 'Max', image: 'https://example.com/pets/max.jpg' },
      { id: 3, name: 'Luna', image: 'https://example.com/pets/luna.jpg' }
    ];
  
    // Construct the pet selection HTML dynamically
    let petOptions = pets.map(pet => {
      return `
        <div class="flex items-center mb-4">
          <input type="radio" id="pet-${pet.id}" name="pet" value="${pet.id}" class="mr-3" />
          <img src="${pet.image}" alt="${pet.name}" class="w-16 h-16 rounded-full border-2 border-gray-300 mr-3" />
          <label for="pet-${pet.id}" class="text-lg font-medium">${pet.name}</label>
        </div>
      `;
    }).join('');
  
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
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Book it!',
      cancelButtonText: 'No, Cancel',
      preConfirm: () => {
        const selectedPetId = (document.querySelector('input[name="pet"]:checked') as HTMLInputElement)?.value;
                if (!selectedPetId) {
          Swal.showValidationMessage('Please select a pet to proceed!');
          return false;
        }
  
        return selectedPetId; 
      },
      willClose: () => {
        const selectedPetInput = document.querySelector('input[name="pet"]:checked') as HTMLInputElement | null;
        if (selectedPetInput) {
          selectedPetInput.checked = false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const petId = result.value;
        const selectedPet = pets.find(pet => pet.id === parseInt(petId, 10));
  
        if (selectedPet) {
          Swal.fire(
            'Appointment Booked!',
            `Your appointment with ${selectedPet.name} has been successfully scheduled!`,
            'success'
          );
        } else {
          Swal.fire('Error', 'There was an issue booking the appointment.', 'error');
        }
      }
    });
  }
  
}
