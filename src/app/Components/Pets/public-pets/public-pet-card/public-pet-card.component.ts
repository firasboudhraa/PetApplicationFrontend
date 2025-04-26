import { Component, Input } from '@angular/core';
import { Pet } from 'src/app/models/pet';

@Component({
  selector: 'app-public-pet-card',
  templateUrl: './public-pet-card.component.html',
  styleUrls: ['./public-pet-card.component.css']
})
export class PublicPetCardComponent {
@Input() pet!: Pet;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';


  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
}
}
