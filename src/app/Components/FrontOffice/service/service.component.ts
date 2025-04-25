import { Component } from '@angular/core';
import  { PetServiceService } from 'src/app/Services/pet-service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  services : any[] = [];
  constructor( private ps:PetServiceService) { }

  ngOnInit(): void {
    this.ps.getServices().subscribe(
      (data) => this.services = data
    );
  }


  selectedService: any = null;

  openModal(service: any) {
    this.selectedService = service;
    const modalElement = document.getElementById('serviceModal');
    if (modalElement) {
      (modalElement as any).classList.add('show');
      (modalElement as any).style.display = 'block';
    }
  }

  closeModal() {
    const modalElement = document.getElementById('serviceModal');
    if (modalElement) {
      (modalElement as any).classList.remove('show');
      (modalElement as any).style.display = 'none';
    }
  }

  bookAppointment(service: any) {
    alert(`Booking an appointment for: ${service.name}`);
    this.closeModal();
  }

}
