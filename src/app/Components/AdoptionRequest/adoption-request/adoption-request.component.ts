import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adoption-request',
  templateUrl: './adoption-request.component.html',
  styleUrls: ['./adoption-request.component.css']
})
export class AdoptionRequestComponent {
  petId!: number;
  userId!: number;
  ownerId!: number;

  constructor(private route: ActivatedRoute) {}
  adoptionForm! : FormGroup ;
  
  ngOnInit(): void {
    // Retrieve the query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.petId = +params['petId'];  // Using '+' to convert to number
      this.userId = +params['userId'];
      this.ownerId = +params['ownerId'];
      
      // Log the values or use them in your logic
      console.log(`Pet ID: ${this.petId}, User ID: ${this.userId}, Owner ID: ${this.ownerId}`);
    })
  }
}
