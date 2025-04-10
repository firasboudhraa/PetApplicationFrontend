import { Component } from '@angular/core';
import  { FormGroup, FormControl, Validators } from '@angular/forms';
import  { Router,  ActivatedRoute } from '@angular/router';
import  { PetServiceService } from 'src/app/Services/pet-service.service';

@Component({
  selector: 'app-modify-service',
  templateUrl: './modify-service.component.html',
  styleUrls: ['./modify-service.component.css']
})
export class ModifyServiceComponent {
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

  onSubmit(){
    this.loading = true;
    const formData = { 
      ...this.serviceForm.value, 
      idService: +this.Act.snapshot.params['id'],  // Convert id to a number
      providerId: 1 
    };    console.log('Form Data to Submit:',formData);
    this.ps.updateService(formData).subscribe(
      () => {
        this.loading = false;
        this.serviceForm.reset();
        this.router.navigate(['/service']);
      }
    );
  }

}
