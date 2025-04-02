import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pet } from '../models/pet';

@Component({
  selector: 'app-medicalnotebook-form',
  templateUrl: './medicalnotebook-form.component.html',
  styleUrls: ['./medicalnotebook-form.component.css']
})
export class MedicalnotebookFormComponent implements OnInit {
  carnetForm!: FormGroup;
  recordForm!: FormGroup;
  carnets: any[] = [];
  records: any[] = [];
  selectedCarnet: any = null;
  selectedRecord: any = null;
  pets: Pet[] = [
    { id: 1, name: 'Rex', imagePath: 'assets/dog1.jpg', species: 'Chien', age: 3, color: 'Marron', sex: 'Mâle', ownerId: 101, description: 'Chien affectueux et joueur.', forAdoption: false, location: 'Paris' },
    { id: 2, name: 'Misty', imagePath: 'assets/cat1.jpg', species: 'Chat', age: 2, color: 'Gris', sex: 'Femelle', ownerId: 102, description: 'Chat calme et doux.', forAdoption: true, location: 'Lyon' },
    { id: 3, name: 'Charlie', imagePath: 'assets/dog2.jpg', species: 'Chien', age: 5, color: 'Noir', sex: 'Mâle', ownerId: 103, description: 'Chien énergique et intelligent.', forAdoption: false, location: 'Marseille' },
  ];

  constructor(
    private fb: FormBuilder,
   
  ) {}

  ngOnInit(): void {
    this.initForms();
   
  }

  initForms() {
    this.carnetForm = this.fb.group({
      id: [null],
      medicalHistory: ['', Validators.required],
      pet_id: ['', Validators.required]
    });

    this.recordForm = this.fb.group({
      id: [null],
      date: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(30)]],
      veterinarian_id: ['', Validators.required],
      next_due_date: [''],
      carnet_id: ['', Validators.required],
      attachments: [[]]
    });
  }
/*
  loadCarnets() {
    this.carnetService.getAll().subscribe(data => this.carnets = data);
  }

  loadRecords() {
    this.recordService.getAll().subscribe(data => this.records = data);
  }

  saveCarnet() {
    if (this.carnetForm.valid) {
      this.carnetService.save(this.carnetForm.value).subscribe(() => this.loadCarnets());
    }
  }

  saveRecord() {
    if (this.recordForm.valid) {
      this.recordService.save(this.recordForm.value).subscribe(() => this.loadRecords());
    }
  }

  editCarnet(carnet: any) {
    this.carnetForm.patchValue(carnet);
  }

  editRecord(record: any) {
    this.recordForm.patchValue(record);
  }

  deleteCarnet(id: string) {
    this.carnetService.delete(id).subscribe(() => this.loadCarnets());
  }

  deleteRecord(id: string) {
    this.recordService.delete(id).subscribe(() => this.loadRecords());
  }*/
}
