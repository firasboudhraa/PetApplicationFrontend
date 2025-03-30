import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';

@Component({
  selector: 'app-add-pet-modal',
  templateUrl: './add-pet-modal.component.html',
  styleUrls: ['./add-pet-modal.component.css']
})
export class AddPetModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() petAdded = new EventEmitter<void>(); // New event emitter for success

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
      sex: new FormControl('', Validators.required)
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
      formData.append('ownerId', '1');

      // Append the file if it exists
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.petDataService.addPet(formData).subscribe(
        (response) => {
          console.log('Pet added successfully:', response.status);
          this.petAdded.emit(); // Emit the success event
          this.closeModal();
        },
        (error) => {
          console.error('Error adding pet:', error);
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
        this.petForm.get('imagePath')?.setValue(null); // Clear the form control
      } else {
        this.imageError = null;
        this.selectedImage = file;
        this.petForm.get('imagePath')?.setValue(file); // Set the file object in the form control
      }
    }
  }
}
