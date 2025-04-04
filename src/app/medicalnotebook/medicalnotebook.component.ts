import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Carnet } from '../models/carnet';
import { RecordTypeEnum } from '../models/recordtypeEnum';
import { MedicalService } from '../Services/medical.service';


@Component({
  selector: 'app-medicalnotebook',
  templateUrl: './medicalnotebook.component.html',
  styleUrls: ['./medicalnotebook.component.css']
})
export class MedicalnotebookComponent implements OnInit {
  constructor(private router: Router,private medicalService: MedicalService) {}

  carnets_test = [
    { medicalHistory: 'Historique Médical 1', pet_name: 'hhgff1234' },
    { medicalHistory: 'Historique Médical 2', pet_name: 'vvvvv5678' },
    { medicalHistory: 'Historique Médical 3', pet_name: 'aaaaa91011' }
  ];




  carnets: Carnet[] = [
    {
      id: '1',
      pet_id: '325',
      medicalHistory: [
        {
          id: 'rec1',
          name: 'Carnet Médical Médor',
          date: new Date('2024-03-01'),
          type: RecordTypeEnum.VACCINATION, 
          description: 'Vaccination annuelle',
          veterinarian_id: 'vet001',
          next_due_date: new Date('2025-03-01'),
          carnet_id: '1'
        },
        {
          id: 'rec2',
          name: 'Carnet Médical Médor',
          date: new Date('2024-06-15'),
          type: RecordTypeEnum.CHECKUP, 
          description: 'Contrôle général',
          veterinarian_id: 'vet002',
          next_due_date: new Date('2024-12-15'),
          carnet_id: '1'
        }
      ]
    },
    {
      id: '2',
      pet_id: '123',
      medicalHistory: [
        {
          id: 'rec3',
          name: 'Carnet Médical Bella',
          date: new Date('2023-09-10'),
          type: RecordTypeEnum.SURGERY, 
          description: 'Opération des ligaments croisés',
          veterinarian_id: 'vet003',
          next_due_date: new Date('2024-09-10'),
          carnet_id: '2'
        }
      ]
    }
  ];
  
  

  Carnets: any[] = [];
  records: any[] = [];


  ngOnInit(): void {
    
  }

  

  navigateToMedicalNotebookForm(): void {
    this.router.navigate(['/medicalnotebookform']);
  }
}
