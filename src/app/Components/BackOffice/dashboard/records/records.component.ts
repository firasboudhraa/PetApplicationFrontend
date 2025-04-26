import { Component, OnInit } from '@angular/core';
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


  constructor(private medicalRecordService: MedicalService) {}

  ngOnInit(): void {
    // Appeler la méthode du service pour récupérer les carnets médicaux
    this.loadMedicalRecords();
  }

  loadMedicalRecords() {
    this.medicalRecordService.getAllRecords().subscribe(data => {
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
    }, error => {
      console.error('Erreur lors du chargement des enregistrements médicaux :', error);
    });
  }
  
  
  
}  