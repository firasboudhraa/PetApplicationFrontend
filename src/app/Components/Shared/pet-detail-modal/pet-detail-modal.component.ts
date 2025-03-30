import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';

@Component({
  selector: 'app-pet-detail-modal',
  templateUrl: './pet-detail-modal.component.html',
  styleUrls: ['./pet-detail-modal.component.css']
})
export class PetDetailModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() pet!: Pet; 
  @Output() petRemoved = new EventEmitter<void>(); // New event emitter for success

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';
  constructor(private petDataService : PetdataServiceService){}

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }
  closeModal() {
    this.close.emit();
  }
  removePet(id:number) {
    this.petDataService.removePet(id).subscribe({
      next: (response) => {
        console.log('Pet removed successfully', response);
        this.closeModal();
        this.petRemoved.emit();
      },
      error: (error) => {
        console.error('Error removing pet', error);
      }
    });
  }
}
