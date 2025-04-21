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
name: any;
editRecord(arg0: any) {
throw new Error('Method not implemented.');
}
  
  carnetId!: number;
  carnetname!: string;

  records: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private medicalRecordService: MedicalService
  ) {}

  ngOnInit(): void {
    this.carnetId = +this.route.snapshot.paramMap.get('id')!;
    this.carnetname = this.route.snapshot.paramMap.get('name')!;

    this.loadMedicalRecords();
  }



  loadMedicalRecords() {
    this.medicalRecordService.getMedicalRecordsByCarnetId(this.carnetId).subscribe(data => {
      console.log('DATA REÇUE : ', data);
      this.records = data.medicalRecords; // On suppose que les données renvoyées sont un tableau d'enregistrements
      name:data.name;
    });
  }

}
