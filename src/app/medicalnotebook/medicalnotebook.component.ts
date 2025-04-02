import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicalnotebook',
  templateUrl: './medicalnotebook.component.html',
  styleUrls: ['./medicalnotebook.component.css']
})
export class MedicalnotebookComponent {
  constructor(private router: Router) {}

navigateToMedicalNotebookForm() {
  this.router.navigate(['/medicalnotebookform']);
}
  
  carnets = [
    { medicalHistory: 'Historique Médical 1', pet_name: 'hhgff1234' },
    { medicalHistory: 'Historique Médical 2', pet_name: 'vvvvv5678' },
    { medicalHistory: 'Historique Médical 3', pet_name: 'aaaaa91011' }
  ];
  }
  

