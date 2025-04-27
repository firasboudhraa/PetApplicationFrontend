import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalService } from 'src/app/Services/medical.service';
import { Record } from 'src/app/models/records';  // Assure-toi d'importer le bon modèle

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
deleteRecord(record: any) {

    const recordId = record.id;
    console.log('Suppression de l’enregistrement avec ID :', recordId);
  
    this.medicalRecordService.deleteMedicalRecord(recordId).subscribe({
      next: () => {
        console.log('Enregistrement supprimé avec succès.');
        this.loadMedicalRecords(); // Recharge les enregistrements affichés
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
      }
    });
  }
editRecord(arg0: number) {
throw new Error('Method not implemented.');
}
  medicalRecords: Record[] = [];  // Utilisation du modèle Record explicite


  constructor(private medicalRecordService: MedicalService,private fb: FormBuilder) {}
  recordForm!: FormGroup; // Déclaration du formulaire

  ngOnInit(): void {
    this.loadMedicalRecords();
    this.loadCarnets();

    // Initialisation du FormGroup
    this.recordForm = this.fb.group({
      date: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(30)]],
      veterinarian_id: ['', Validators.required],
      next_due_date: [''],
      carnet_Id: ['', Validators.required],
      poids: ['', [Validators.required, Validators.min(0)]]
    });
  }


  loadMedicalRecords() {
    this.medicalRecordService.getAllRecords().subscribe({
      next: (data) => {
        console.log('DATA REÇUE :', data);
    
        this.medicalRecords = data.map((record: any) => {
          console.log("Record reçu :", record);
    
          // Remap _id vers id si nécessaire
          if (record._id && !record.id) {
            record.id = record._id;
          }
    
          // Utiliser imagePath si imageUrl est null
          const imageName = record.imageUrl && record.imageUrl.trim() !== ''
            ? record.imageUrl
            : record.imagePath && record.imagePath.trim() !== ''
              ? record.imagePath
              : null;
    
          record.imageUrl = imageName;
    
          return record;
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des enregistrements médicaux :', error);
      }
    });
  }
  
  loadCarnets(): void {
    this.medicalRecordService.getAllCarnets().subscribe({
      next: (response) => {
        console.log('Carnets récupérés:', response); // Vérifiez que vous recevez la liste correcte
        this.carnets = response; // Assurez-vous que 'carnets' est un tableau
      },
      error: (error) => {
        console.error('Erreur lors du chargement des carnets:', error);
      }
    });
  }
  carnets!: any[];

  // Variables à ajouter
showAddForm: boolean = false;
selectedImage: File | null = null;

// Fonction pour afficher/cacher le formulaire
toggleAddForm(): void {
  this.showAddForm = true;
}

// Fonction pour annuler l'ajout
cancelAdd(): void {
  this.showAddForm = false;
  this.recordForm.reset();
  this.selectedImage = null;
}

// Fonction pour sauvegarder un record
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

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.medicalRecordService.createMedicalRecordWithFile(formData).subscribe({
      next: (response) => {
        console.log('Record médical ajouté avec succès :', response);
        alert('Record ajouté avec succès ✅');
        this.loadMedicalRecords(); // <-- Recharge la liste si tu as cette fonction
        this.cancelAdd(); // <-- Cache le formulaire
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

// Fonction pour récupérer l'image uploadée
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedImage = input.files[0];
    console.log('Image sélectionnée :', this.selectedImage);
  }
}

  
}  