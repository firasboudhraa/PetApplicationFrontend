import { Component } from '@angular/core';
import { PetServiceService } from 'src/app/Services/pet-service.service';

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
}
