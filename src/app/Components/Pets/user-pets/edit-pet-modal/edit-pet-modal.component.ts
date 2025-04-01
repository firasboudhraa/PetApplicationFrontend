import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pet } from 'src/app/models/pet';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-pet-modal',
  templateUrl: './edit-pet-modal.component.html',
  styleUrls: ['./edit-pet-modal.component.css']
})
export class EditPetModalComponent {
 @Input() isVisible: boolean = false;
 @Input() pet!: Pet;
  @Output() close = new EventEmitter<void>();
  @Output() petEdited = new EventEmitter<void>(); // New event emitter for success
  
  confirmationShowed: boolean = false;

  showConfirmButton() {
    this.confirmationShowed = true;
  }
  hideConfirmButton() {
    this.confirmationShowed = false;
  }
  closeModal() {
    this.close.emit();
  }

  constructor(private petDataService: PetdataServiceService) {}

  petForm!: FormGroup;
  selectedImage: File | null = null;
  imageError: string | null = null;

  ngOnInit() {
    this.petForm = new FormGroup({
      name: new FormControl('', Validators.required),
      imagePath: new FormControl('', ),
      species: new FormControl('', Validators.required),
      age: new FormControl('', [Validators.required, Validators.min(0)]),
      color: new FormControl('', Validators.required),
      sex: new FormControl('', Validators.required),
      description: new FormControl('', ), 
      forAdoption: new FormControl(false, )
    });
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pet'] && changes['pet'].currentValue) {
      this.petForm.patchValue({
        name: this.pet.name,
        species: this.pet.species,
        age: this.pet.age,
        color: this.pet.color,
        sex: this.pet.sex
      });    
    }
  }

  onSubmit() {
    if (this.petForm.valid) {
      const formData = new FormData();
      formData.append('name', this.petForm.get('name')?.value);
      formData.append('species', this.petForm.get('species')?.value);
      formData.append('age', this.petForm.get('age')?.value);
      formData.append('color', this.petForm.get('color')?.value);
      formData.append('sex', this.petForm.get('sex')?.value);
      formData.append('description', this.petForm.get('description')?.value); 
      formData.append('forAdoption', this.petForm.get('forAdoption')?.value );
      formData.append('ownerId', '1');

      // Append the file if it exists

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      // Call the updatePet method with the pet ID
      this.petDataService.updatePet(this.pet.id, formData).subscribe(
        (response) => {
          console.log('Pet updated successfully:', response);
          this.petEdited.emit(); // Emit the success event
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Pet Updated',
            text: '✅ Your Pet was updated successfully!',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        },
        (error) => {
          console.error('Error updating pet:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to update your pet.',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        }
      );
      this.hideConfirmButton();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.imageError = 'Only image files are allowed.';
        this.selectedImage = null;
        this.petForm.get('imagePath')?.setValue(null); // Clear the form control
      } else {
        this.imageError = null;
        this.selectedImage = file;
        this.petForm.get('imagePath')?.setValue(file); // Set the file object in the form control
      }
    }
  }
}
