import { Component } from '@angular/core';
import type { PetService } from 'src/app/models/service';
import  { PetServiceService } from 'src/app/Services/pet-service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  services : any[] = [];
  chunkedServices: any[] = [];
  constructor( private ps:PetServiceService) { }

  ngOnInit(): void {
    this.ps.getServices().subscribe(
      (data) =>{ 
        this.services = data 
        console.log(this.services)
        this.chunkArray(this.services, 3);
      }
    );
  }
  chunkArray(array: any[], size: number) {
    this.chunkedServices = [];
    for (let i = 0; i < array.length; i += size) {
      this.chunkedServices.push(array.slice(i, i + size));
    }
    console.log(this.chunkedServices);
  }



}
