import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {

  calendarPlugins = [ 
    dayGridPlugin ];

    calendarOptions: CalendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin], 
      initialView: 'dayGridMonth', 
      selectable: true,
      editable: true,
      events: [
        { title: 'Meeting', date: '2024-04-10' },
        { title: 'Conference', date: '2024-04-15' }
      ],
      dateClick: this.handleDateClick.bind(this)
    };

  handleDateClick(arg: any) {
    alert('Date clicked: ' + arg.dateStr);
  }

}
