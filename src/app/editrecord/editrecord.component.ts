import { Component, OnInit } from '@angular/core';
import { Record, RecordTypeEnum } from '../models/records';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalService } from '../Services/medical.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-editrecord',
  templateUrl: './editrecord.component.html',
  styleUrls: ['./editrecord.component.css']
})
export class EditrecordComponent implements OnInit {
  recordId!: number;
  /*record: Record = {
    id: 0,
    dateTime: '',
    description: '',
    poids: 0,
    nextDate: '',
    date: '',
    type: RecordTypeEnum.VACCINATION,
    next_due_date: new Date(),
    carnet_id: '',
    imageUrl: ''
  };*/
  record: any = {}; // Initialize with an empty object
  editForm!: FormGroup;

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

  retour(){
    this.router.navigate(['/medicalnotebook']);
  }

  successMessage: string = '';

  onSubmit(): void {
    if (!this.record || !this.record.type || !this.record.dateTime) {
      console.error('Record or required fields are not defined');
      return;
    }
  
    this.medicalService.updateMedicalRecord(this.record.id, this.record).subscribe({
      next: (response) => {
        console.log('Record updated successfully:', response);
        this.successMessage = '✅ Le record médical a été mis à jour avec succès !';
  
        // Optionnel : Efface le message après 5 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        console.error('Error updating record:', err);
      }
    });
  }
  selectedImage: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      console.log('Image sélectionnée :', this.selectedImage);
    }
  }

   }