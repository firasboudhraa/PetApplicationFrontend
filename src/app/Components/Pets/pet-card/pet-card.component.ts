import { Component, Input } from '@angular/core';
import { Pet } from 'src/app/models/pet';

@Component({
  selector: 'app-pet-card',
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.css']
})
export class PetCardComponent {
  @Input() pet!: Pet;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';


  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
}
}
