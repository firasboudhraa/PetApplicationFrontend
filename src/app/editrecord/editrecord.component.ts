import { Component, OnInit } from '@angular/core';
import { Record, RecordTypeEnum } from '../models/records';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalService } from '../Services/medical.service';
@Component({
  selector: 'app-editrecord',
  templateUrl: './editrecord.component.html',
  styleUrls: ['./editrecord.component.css']
})
export class EditrecordComponent implements OnInit {
  recordId!: number;
  record: Record = {
    id: 0,
    dateTime: '',
    description: '',
    poids: 0,
    nextDate: '',
    date: '',
    type: RecordTypeEnum.VACCINATION,
    next_due_date: new Date(),
    carnet_id: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicalService: MedicalService
  ) {}

  ngOnInit(): void {
    this.recordId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRecord();
  }

  loadRecord(): void {
    this.medicalService.getMedicalRecordById(this.recordId).subscribe({
      next: (data: Record) => {
        this.record = data;
      },
      error: (err) => {
        console.error('Erreur de récupération du record', err);
      }
    });
  }

  submitUpdate(): void {
    this.medicalService.updateMedicalRecord(this.record).subscribe({
      next: () => {
        alert('Mise à jour réussie');
        this.router.navigate(['/dashboard/records']);
      },
      error: (err) => {
        console.error('Erreur de mise à jour', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }}