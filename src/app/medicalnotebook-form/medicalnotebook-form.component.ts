import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pet } from '../models/pet';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalService } from '../Services/medical.service';

@Component({
  selector: 'app-medicalnotebook-form',
  templateUrl: './medicalnotebook-form.component.html',
  styleUrls: ['./medicalnotebook-form.component.css']
})
export class MedicalnotebookFormComponent implements OnInit {
  carnetForm!: FormGroup;
  recordForm!: FormGroup;
  carnets: any[] = [{
     id: 2,
      pet_id: 12 
  }];
  records: any[] = [];
  pets: Pet[] = [
    { id: 1, name: 'Rex', imagePath: 'assets/dog1.jpg', species: 'Chien', age: 3, color: 'Marron', sex: 'Mâle', ownerId: 101, description: 'Chien affectueux et joueur.', forAdoption: false, location: 'Paris' },
    { id: 2, name: 'Misty', imagePath: 'assets/cat1.jpg', species: 'Chat', age: 2, color: 'Gris', sex: 'Femelle', ownerId: 102, description: 'Chat calme et doux.', forAdoption: true, location: 'Lyon' },
    { id: 3, name: 'Charlie', imagePath: 'assets/dog2.jpg', species: 'Chien', age: 5, color: 'Noir', sex: 'Mâle', ownerId: 103, description: 'Chien énergique et intelligent.', forAdoption: false, location: 'Marseille' },
  ];  id!: string; // ID du carnet ou record en cours d’édition

  constructor(
    private fb: FormBuilder,
    private act: ActivatedRoute,
    private rt: Router,
    private medicalService: MedicalService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadPets();
    this.loadCarnets();

    // 1. Récupérer l’ID du carnet si on édite un carnet
    this.id = this.act.snapshot.params['id'];
    if (this.id) {
      this.loadCarnetById(this.id);
    }
  }

  /** 🔹 Initialisation des formulaires */
  initForms() {
    this.carnetForm = this.fb.group({
      pet_id: ['', Validators.required] // Uniquement la sélection d'un animal
    });

    this.recordForm = this.fb.group({
      date: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(30)]],
      veterinarian_id: ['', Validators.required],
      next_due_date: [''],
      carnet_id: ['', Validators.required],
      attachments: [[]]
    });
  }

  /** 🔹 Charger tous les carnets */
  loadCarnets() {
    this.medicalService.getAllCarnets().subscribe(
      (data) => (this.carnets = data),
      (error) => console.error("Erreur de chargement des carnets", error)
    );
  }

  /** 🔹 Charger un carnet par ID */
  loadCarnetById(id: string) {
    this.medicalService.getCarnetById(id).subscribe(
      (carnet) => {
        this.carnetForm.patchValue(carnet);
      },
      (error) => console.error("Erreur de chargement du carnet", error)
    );
  }

  /** 🔹 Charger la liste des animaux */
  loadPets() {
    this.medicalService.getAllPets().subscribe(
      (data) => (this.pets = data),
      (error) => console.error("Erreur de chargement des animaux", error)
    );
  }

  /** 🔹 Sauvegarder un carnet */
  saveCarnet() {
    if (this.carnetForm.valid) {
      if (this.id) {
        // Mise à jour d’un carnet existant
        this.medicalService.updateCarnet(this.carnetForm.value, this.id).subscribe(
          () => this.rt.navigateByUrl('/carnets'),
          (error) => console.error("Erreur de mise à jour du carnet", error)
        );
      } else {
        // Création d’un nouveau carnet
        this.medicalService.addCarnet(this.carnetForm.value).subscribe(
          () => this.rt.navigateByUrl('/carnets'),
          (error) => console.error("Erreur d'ajout du carnet", error)
        );
      }
    }
  }

  /** 🔹 Sauvegarder un record */
  saveRecord() {
    if (this.recordForm.valid) {
      this.medicalService.addRecord(this.recordForm.value).subscribe(
        () => {
          this.rt.navigateByUrl('/records');
          this.recordForm.reset();
        },
        (error) => console.error("Erreur d'ajout du record", error)
      );
    }
  }








/*saveCarnet() {
throw new Error('Method not implemented.');
}
navigateToMedicalNotebookForm() {
throw new Error('Method not implemented.');
}
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
  medicalService: any;

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
    });*/
  
  
  
  
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
  }

    addCarnet() {
      if (this.carnetForm.valid) {
        const newCarnet = this.carnetForm.value;
        this.medicalService.addCarnet(newCarnet);
        this.carnetForm.reset();
      }
    }
  
    addRecord() {
      if (this.recordForm.valid) {
        const newRecord = this.recordForm.value;
        this.medicalService.addRecord(newRecord);
        this.recordForm.reset();
      }
    }*/

