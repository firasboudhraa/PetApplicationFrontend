import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pet } from 'src/app/models/pet';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetSittingOfferService } from 'src/app/Services/pet-sitting-offer.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../FrontOffice/user/auth/auth.service';

@Component({
  selector: 'app-look-for-asitter-form',
  templateUrl: './look-for-asitter-form.component.html',
  styleUrls: ['./look-for-asitter-form.component.css'],
})
export class LookForASitterFormComponent implements OnInit {
  pets! :Pet[] ;
  selectedPet: number | null = null;
  selectedPetName: string | null = null;  startDate: string = '';
  petSittingForm!: FormGroup;
  isPaid: boolean = false; 

  endDate: string = '';
  userId!: any; 
  private apiUrl = 'http://localhost:8222/api/v1/pet/images';

  constructor(private fb: FormBuilder,private petDataService: PetdataServiceService,
    private authService:AuthService ,
     private petSittingOfferService:PetSittingOfferService) {}

  ngOnInit(): void {
    this.userId = this.authService.getDecodedToken() ? this.authService.getDecodedToken()?.userId : 0 ;
    this.petDataService.getPetsByOwnerId(this.userId).subscribe((data: Pet[]) => {
      this.pets = data;
      console.log(this.pets);
    });

    // Initialize the form
    this.petSittingForm = this.fb.group({
      pet: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      offerType: ['Free', Validators.required], // Default to 'free'
      amountPerDay: [null], // Only required if offerType is 'paid'
    });
  }



  setOfferType(type: string): void {
    this.petSittingForm.get('offerType')?.setValue(type); // Update the form control value
    this.isPaid = type === 'Paid'; 

    const amountPerDayControl = this.petSittingForm.get('amountPerDay');
    if (!this.isPaid) {
      this.petSittingForm.get('amountPerDay')?.setValue(null);
    } 
  }

  selectPet(pet: any): void {
    this.petSittingForm.controls['pet'].setValue(pet);
    this.selectedPet = pet.id;
    this.selectedPetName = pet.name;
  }
  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }
  submitRequest(): void {
    console.log(this.petSittingForm.value);
    if (this.petSittingForm.valid) {
      this.petSittingOfferService.savePetSittingOffer(this.petSittingForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your pet sitting offer has been submitted successfully!',
            confirmButtonText: 'OK'
          }).then(() => {
            this.petSittingForm.reset();
            this.selectedPet = null;
            this.selectedPetName = null;
          }
          );  
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error submitting your request. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please fill in all required fields.',
        confirmButtonText: 'OK'
      });
    }
  }

  
}
