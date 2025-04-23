import { Component } from '@angular/core';
import  { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import  { Router } from '@angular/router';
import  { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajout-service',
  templateUrl: './ajout-service.component.html',
  styleUrls: ['./ajout-service.component.css']
})
export class AjoutServiceComponent {
  serviceForm!: FormGroup;
  loading = false;

  constructor(private ps: PetServiceService, private router: Router) {
    this.serviceForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      durationInMinutes: new FormControl(null, [Validators.required, Validators.min(10)]),
      address: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = new Date(group.get('startDate')?.value);
    const end = new Date(group.get('endDate')?.value);
    if (start && end && end <= start) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  onSubmit() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = { ...this.serviceForm.value, providerId: 1 };

    this.ps.addService(formData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Service Added',
          text: 'The service has been successfully created!',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.serviceForm.reset();
          this.router.navigate(['/dashboard/services']);
        });
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'Something went wrong. Please try again later.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

}
