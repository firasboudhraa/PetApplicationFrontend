import { Component, OnInit } from '@angular/core';
import { MedicalService } from '../Services/medical.service';
import { Record, RecordTypeEnum } from 'src/app/models/records';  // Assure-toi d'importer le bon modèle
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
editRecord(arg0: any) {
throw new Error('Method not implemented.');
}
  
  carnetId!: number;
  records: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private medicalRecordService: MedicalService
  ) {}

  ngOnInit(): void {
    this.carnetId = +this.route.snapshot.paramMap.get('id')!;
    this.loadMedicalRecords();
  }



  loadMedicalRecords() {
    this.medicalRecordService.getMedicalRecordsByCarnetId(this.carnetId).subscribe(data => {
      console.log('DATA REÇUE : ', data);
      this.records = data.medicalRecords; // 👈 On récupère bien le tableau d'enregistrements
    });
  }
  

}
