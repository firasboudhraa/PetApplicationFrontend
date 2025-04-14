import { Component, OnInit } from '@angular/core';
import { MedicalService } from 'src/app/Services/medical.service';
import { Record } from 'src/app/models/records';  // Assure-toi d'importer le bon modèle

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  medicalRecords: Record[] = [];  // Utilisation du modèle Record explicite


  constructor(private medicalRecordService: MedicalService) {}

  ngOnInit(): void {
    // Appeler la méthode du service pour récupérer les carnets médicaux
    this.loadMedicalRecords();
  }

  // Charger les carnets médicaux depuis le service
  loadMedicalRecords(): void {
    this.medicalRecordService.getAllRecords().subscribe(
      (response) => {
        this.medicalRecords = response.map((item: any) => ({
          date: item.date, // Add 'date' property
          dateTime: item.date, // Map 'date' to 'dateTime'
          type: item.type,
          description: item.description,
          next_due_date: item.next_due_date,
          carnet_id: item.carnet_id,
          poids: item.poids
        })); // Stocker la réponse dans la variable
      },
      (error) => {
        console.error('Erreur lors de la récupération des carnets médicaux', error);
      }
    );
  }
}
