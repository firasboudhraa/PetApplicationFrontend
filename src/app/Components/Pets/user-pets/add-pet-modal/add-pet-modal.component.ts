import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-pet-modal',
  templateUrl: './add-pet-modal.component.html',
  styleUrls: ['./add-pet-modal.component.css']
})
export class AddPetModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() petAdded = new EventEmitter<void>(); 

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
      imagePath: new FormControl('', Validators.required),
      species: new FormControl('', Validators.required),
      age: new FormControl('', [Validators.required, Validators.min(0)]),
      color: new FormControl('', Validators.required),
      sex: new FormControl('', Validators.required),
      description: new FormControl('', ), 
      forAdoption: new FormControl(false, )
    });
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

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.petDataService.addPet(formData).subscribe(
        (response) => {
          console.log('Pet added successfully:', response);
          this.petAdded.emit();
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Pet Added',
            text: '✅ Your Pet was Added successfully!',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        },
        (error) => {
          console.error('Error adding pet:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to Add your pet.',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.imageError = 'Only image files are allowed.';
        this.selectedImage = null;
        this.petForm.get('imagePath')?.setValue(null); 
      } else {
        this.imageError = null;
        this.selectedImage = file;
        this.petForm.get('imagePath')?.setValue(file); 
      }
    }
  }
}
