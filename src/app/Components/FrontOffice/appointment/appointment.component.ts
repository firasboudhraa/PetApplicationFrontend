import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import { DatePipe } from '@angular/common';
import  { AppointmentService } from 'src/app/Services/appointment.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  providers: [DatePipe] 
})
export class AppointmentComponent {
  serviceId!: number;
  serviceName!: string;
  availableSlots: string[] = [];
  selectedDate: string | null = null;  

  constructor(private route: ActivatedRoute, 
              private service: PetServiceService,
              private as: AppointmentService,
              private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.params['id'];
    this.service.getServiceById(this.serviceId).subscribe(data => {
      this.serviceName = data.name;
    });
    this.service.getAvailableSlots(this.serviceId).subscribe(data => {
      this.availableSlots = data; 
    });
  }

  selectSlot(slot: string): void {
    this.selectedDate = slot; 
  }

  confirmAppointment(): void {
    if (this.selectedDate) {
      console.log('Appointment confirmed for:', this.selectedDate);
    } else {
      alert('Please select a time slot!');
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, yyyy h:mm a') || date;
  }
}
