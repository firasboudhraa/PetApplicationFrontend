import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pet-detail-modal',
  templateUrl: './pet-detail-modal.component.html',
  styleUrls: ['./pet-detail-modal.component.css']
})
export class PetDetailModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() passToEdit = new EventEmitter<void>();
  @Input() pet!: Pet; 
  @Output() petRemoved = new EventEmitter<void>(); 
  confirmationShowed: boolean = false;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';
  constructor(private petDataService : PetdataServiceService){}
  openEditModal(){
    console.log("clicked") ;
    this.close.emit();
    this.passToEdit.emit() ;
  }
  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }
  showConfirmButton() {
    this.confirmationShowed = true;
  }
  hideConfirmButton() {
    this.confirmationShowed = false;
  }
  closeModal() {
    this.close.emit();
  }
  removePet(id:number) {
    this.petDataService.removePet(id).subscribe({
      next: () => {
        this.closeModal();
        this.petRemoved.emit();
        Swal.fire({
          icon: 'success',
          title: 'Pet deleted',
          text: '✅ Pet was removed successfully!',
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
          toast: true
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '❌ Failed to delete pet.',
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
          toast: true
        });
      }
    });
    this.hideConfirmButton();
  }
}
