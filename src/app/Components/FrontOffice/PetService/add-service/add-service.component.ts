import { Component } from '@angular/core';
import  { FormGroup, Validators, FormControl } from '@angular/forms';
import  { Router } from '@angular/router';
import  { PetServiceService } from 'src/app/Services/pet-service.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent {
  serviceForm!: FormGroup;
  loading = false;  

  constructor( private ps:PetServiceService , private router:Router) { 
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

onSubmit(){
  this.loading = true;
  const formData = { ...this.serviceForm.value, providerId: 1 };
  console.log(formData);
  this.ps.addService(formData).subscribe(
    () => {
      this.loading = false;
      this.serviceForm.reset();
      this.router.navigate(['/service']);
    }
  );
}

}
