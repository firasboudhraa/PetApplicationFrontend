import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Pet } from 'src/app/models/pet';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-public-pet-detail-modal',
  templateUrl: './public-pet-detail-modal.component.html',
  styleUrls: ['./public-pet-detail-modal.component.css']
})
export class PublicPetDetailModalComponent {
@Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() passToEdit = new EventEmitter<void>();
  @Input() pet!: Pet; 
  @Input() userId!:number;
  @Output() petRemoved = new EventEmitter<void>(); 

  confirmationShowed: boolean = false;

  private apiUrl = 'http://localhost:8222/api/v1/pet/images';
  constructor(private petDataService : PetdataServiceService , private router:Router){}
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
  redirectToRequest(petId:number ,  ownerId:number , userId:number){
    this.closeModal();
    this.router.navigate(['/adoption-request'], {
      queryParams: { petId, userId, ownerId }
    });  }
  
}
