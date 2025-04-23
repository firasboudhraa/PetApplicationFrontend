import { Component } from '@angular/core';
import  { FormGroup, FormControl, Validators } from '@angular/forms';
import  { Router, ActivatedRoute } from '@angular/router';
import  { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.css']
})
export class UpdateServiceComponent {

   id!: number;
    service!: any;
    serviceForm!: FormGroup;
      loading = false;  
    
      constructor( private ps:PetServiceService , private router:Router , private Act:ActivatedRoute) { 
        this.serviceForm = new FormGroup({
          name: new FormControl('', Validators.required),
          description:  new FormControl ('', Validators.required),
          price: new FormControl (null, [Validators.required, Validators.min(1)]),
          durationInMinutes: new FormControl (null, [Validators.required, Validators.min(10)]),
          address: new FormControl (''),
          startDate: new FormControl ('', Validators.required),
          endDate: new FormControl ('', Validators.required)
        });
    }
    
    ngOnInit(): void {
      this.id= this.Act.snapshot.params['id'];
      this.ps.getServiceById(this.id).subscribe(
        (data) => this.serviceForm.patchValue(data)
      );
    }
  
    onSubmit() {
      this.loading = true;
      const formData = { 
        ...this.serviceForm.value, 
        idService: +this.Act.snapshot.params['id'],  
        providerId: 1 
      };
  
      console.log('Form Data to Submit:', formData);
  
      // Call the service update method
      this.ps.updateService(this.id, formData).subscribe(
        (response) => {
          // Success: Show success Swal
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Service updated successfully!',
            text: 'Your service details have been successfully updated.',
            confirmButtonText: 'OK'
          });
  
          this.serviceForm.reset();
          this.router.navigate(['/dashboard/services']);
        },
        (error) => {
          // Failure: Show error Swal
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Update failed',
            text: 'Something went wrong while updating the service. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      );
    }

}
