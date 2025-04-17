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
    { id: 4, name: 'miomioe', imagePath: 'assets/dog2.jpg', species: 'chatton', age: 5, color: 'blanc', sex: 'Mâle', ownerId: 106, description: 'Chien énergique et intelligent.', forAdoption: false, location: 'Marseille' },
  ]; 
  id!: string; // ID du carnet ou record en cours d’édition

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
      attachments: [[]] // Champ pour stocker les fichiers
    });
  }

  saveCarnet(): void {
    if (this.carnetForm.valid) {
      const selectedPetId = +this.carnetForm.value.pet_id;  // Convertir en nombre
      console.log('ID de l\'animal sélectionné:', selectedPetId);
  
      const selectedPet = this.pets.find(pet => pet.id === selectedPetId);  // Trouver l'animal sélectionné
  
      // Vérifiez que selectedPet est bien trouvé et contient les bonnes données
      console.log("Animal sélectionné :", selectedPet);
  
      if (!selectedPet) {
        console.error('Animal non trouvé pour l\'ID:', selectedPetId);
        return;  // Si l'animal n'est pas trouvé, on arrête l'exécution
      }
  
      // Créer l'objet à envoyer à l'API avec l'ID et le nom de l'animal
      const carnetData = { pet_id: selectedPetId, name: selectedPet.name };
  
      // Appeler l'API pour enregistrer le carnet
      this.medicalService.createCarnet(carnetData).subscribe({
        next: (response) => {
          console.log('Carnet créé avec succès:', response);
          this.loadCarnets(); // Recharge les carnets après la création
        },
        error: (error) => {
          console.error('Erreur lors de la création du carnet:', error);
        }
      });
    }
  }

  saveRecord(): void {
    if (this.recordForm.valid) {
      // Récupération des valeurs du formulaire
      const recordData = {
        dateTime: this.recordForm.value.date,
        type: this.recordForm.value.type,
        description: this.recordForm.value.description,
        veterinarian_id: this.recordForm.value.veterinarian_id,
        next_due_date: this.recordForm.value.next_due_date,
        carnetId: this.recordForm.value.carnet_id, // Sélection du carnet
        attachments: this.recordForm.value.attachments // Ajout des pièces jointes (photos)
      };
  
      // Appel à l'API pour ajouter un record médical
      this.medicalService.createMedicalRecord(recordData).subscribe({
        next: (response) => {
          console.log('Record médical ajouté avec succès:', response);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du record médical:', error);
        }
      });
    }
  }

  /** 🔹 Charger tous les carnets */
  loadCarnets(): void {
    this.medicalService.getAllCarnets().subscribe({
      next: (response) => {
        console.log('Carnets récupérés:', response); // Vérifiez que vous recevez la liste correcte
        this.carnets = response; // Assurez-vous que 'carnets' est un tableau
      },
      error: (error) => {
        console.error('Erreur lors du chargement des carnets:', error);
      }
    });
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

  /** 🔹 Gérer les fichiers d'images pour le record médical */
  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.recordForm.patchValue({
        attachments: fileList // Mettre à jour le champ de formulaire pour inclure les fichiers sélectionnés
      });
    }
  }

  
}

  
  
  
  
  




