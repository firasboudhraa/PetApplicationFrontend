import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetService } from 'src/app/models/service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-detail-service',
  templateUrl: './detail-service.component.html',
  styleUrls: ['./detail-service.component.css']
})
export class DetailServiceComponent implements OnInit {
  id!: number;
  service!: PetService;
  availableSlots: string[] = [];

  
  constructor(private ps: PetServiceService, private Act: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.Act.snapshot.params['id'];    
    this.ps.getServiceById(this.id).subscribe(
      (data) => {
        this.service = data;
        this.getAvailableSlots(); 
      }
    );
  }

  getAvailableSlots(): void {
    this.ps.getAvailableSlots(this.id).subscribe(
      (data) => {
        this.availableSlots = data;
        console.log(this.availableSlots);
      }
    );
  }



}
