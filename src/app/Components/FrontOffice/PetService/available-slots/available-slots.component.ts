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
    this.selectedSlot= new Date(arg.event.startStr);
    const formattedDate = this.selectedSlot.toLocaleString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  
    Swal.fire({
      title: 'Book Appointment',
      input: 'text', 
      inputValue: formattedDate, 
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Book it!',
      cancelButtonText: 'No, Cancel',
      inputAttributes: {
        readonly: 'true' 
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Booked!',
          'Your appointment has been scheduled.',
          'success'
        );
      }
    });
  }
}
