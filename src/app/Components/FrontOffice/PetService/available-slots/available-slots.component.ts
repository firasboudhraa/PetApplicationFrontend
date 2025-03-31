import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'; // Week & Day views
import listPlugin from '@fullcalendar/list'; // List view
import { CalendarOptions } from '@fullcalendar/core';
import  { ActivatedRoute, Router } from '@angular/router';
import  { PetServiceService } from 'src/app/Services/pet-service.service';

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css']
})
export class AvailableSlotsComponent {
  id!:number

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
    dateClick: this.handleDateClick.bind(this)
  };

  handleDateClick(arg: any) {
    alert('You clicked on: ' + arg.dateStr);
  }
}
