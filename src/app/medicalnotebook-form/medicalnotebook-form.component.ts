import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pet } from '../models/pet';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalService } from '../Services/medical.service';
import { cl } from '@fullcalendar/core/internal-common';
import { PetdataServiceService } from '../Services/petdata-service.service';
import { UserService } from '../Services/user.service';
import { AuthService } from '../Components/FrontOffice/user/auth/auth.service';


@Component({
  selector: 'app-medicalnotebook-form',
  templateUrl: './medicalnotebook-form.component.html',
  styleUrls: ['./medicalnotebook-form.component.css']
})
export class MedicalnotebookFormComponent implements OnInit {
  carnetForm!: FormGroup;
  recordForm!: FormGroup;
  userId1: number = 3; 

  carnets: any[] = [{
     id: 2,
      pet_id: 12 
  }];
  records: any[] = [];
 /* pets: Pet[] = [
    { id: 1, name: 'Rex', imagePath: 'assets/dog1.jpg', species: 'Chien', age: 3, color: 'Marron', sex: 'Mâle', ownerId: 101, description: 'Chien affectueux et joueur.', forAdoption: false, location: 'Paris' ,adoptionRequests: []},
    { id: 2, name: 'Misty', imagePath: 'assets/cat1.jpg', species: 'Chat', age: 2, color: 'Gris', sex: 'Femelle', ownerId: 102, description: 'Chat calme et doux.', forAdoption: true, location: 'Lyon' ,adoptionRequests: []},
    { id: 3, name: 'Charlie', imagePath: 'assets/dog2.jpg', species: 'Chien', age: 5, color: 'Noir', sex: 'Mâle', ownerId: 103, description: 'Chien énergique et intelligent.', forAdoption: false, location: 'Marseille' ,adoptionRequests: []},
    { id: 4, name: 'miomioe', imagePath: 'assets/dog2.jpg', species: 'chatton', age: 5, color: 'blanc', sex: 'Mâle', ownerId: 106, description: 'Chien énergique et intelligent.', forAdoption: false, location: 'Marseille' ,adoptionRequests: []},

  ]; */ 
  pets: Pet[] = []; // Liste des animaux
  id!: string; // ID du carnet ou record en cours d’édition
  selectedImage: File | null = null;
  userId!: number;
retour(){
  this.rt.navigate(['/medicalnotebook']);
}
  constructor(
    private fb: FormBuilder,
    private act: ActivatedRoute,
    private rt: Router,
    private medicalService: MedicalService,
    private petDataService : PetdataServiceService,
    private sharedDataService: UserService,
     private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadPets();
    this.loadCarnets();
     const userId = this.authService.getDecodedToken()?.userId ?? 0;

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
      next_due_date: [''],
      carnet_id: ['', Validators.required],
      poids: ['', Validators.required] // ✅ Ajouté
    });
    
  }
 
  saveCarnet(): void {
    if (this.carnetForm.valid) {
      const selectedPetId = +this.carnetForm.value.pet_id;  // Convertir en nombre
      console.log('ID de l\'animal sélectionné:', selectedPetId);
  
      const selectedPet = this.pets.find(pet => pet.id === selectedPetId); 
  
      // Vérifiez que selectedPet est bien trouvé et contient les bonnes données
      console.log("Animal sélectionné :", selectedPet);
  
      if (!selectedPet) {
        console.error('Animal non trouvé pour l\'ID:', selectedPetId);
        return;  // Si l'animal n'est pas trouvé, on arrête l'exécution
      }
  
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
      const formData = new FormData();
  
      const formatDateTime = (date: any): string => {
        if (!date) return '';
        const d = new Date(date);
        return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 19);
      };
  
      formData.append('dateTime', formatDateTime(this.recordForm.get('date')?.value));
      formData.append('type', this.recordForm.get('type')?.value);
      formData.append('description', this.recordForm.get('description')?.value);
      formData.append('veterinarian_id', this.recordForm.get('veterinarian_id')?.value);
      formData.append('nextDueDate', formatDateTime(this.recordForm.get('next_due_date')?.value));
      formData.append('carnetId', this.recordForm.get('carnet_id')?.value);
      formData.append('poids', this.recordForm.get('poids')?.value);
  
      // Ajoute un poids temporaire (à adapter selon ton formulaire ou ta logique)
      formData.append('poids', '10'); // exemple
  
      if (this.selectedImage) {
        formData.append('image', this.selectedImage); // <-- nom correct
      }
  
      this.medicalService.createMedicalRecordWithFile(formData).subscribe({
        next: (response) => {
          console.log('Record médical ajouté avec succès :', response);
        },
        error: (err) => {
          console.error('Erreur complète :', err);
          alert(`Erreur : ${err.error?.message || 'Vérifiez les champs'}`);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  }
  
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      console.log('Image sélectionnée :', this.selectedImage);
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
    const userId = this.authService.getDecodedToken()?.userId ?? 0;

  this.petDataService.getPetsByOwnerId(userId).subscribe(
    (data) => (this.pets = data,
      console.log("Liste des animaux", this.pets)

    ),
    (error) => console.error("Erreur de chargement des animaux", error)
  );
}
}








