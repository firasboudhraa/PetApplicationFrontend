import { Component } from '@angular/core';
import { Pet } from 'src/app/models/pet';

@Component({
  selector: 'app-show-pets',
  templateUrl: './show-pets.component.html',
  styleUrls: ['./show-pets.component.css']
})
export class ShowPetsComponent {
  pets: Pet[] = [
    { id: 1,image:"", name: 'Buddy', species: 'Dog', age: 3, color: 'Brown', sex: 'Male' },
    { id: 2,image:"", name: 'Mittens', species: 'Cat', age: 2, color: 'White', sex: 'Female' },
    { id: 3,image:"", name: 'Charlie', species: 'Bird', age: 1, color: 'Yellow', sex: 'Male' }
  ];
}
