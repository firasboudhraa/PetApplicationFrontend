import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MedicalService } from '../Services/medical.service';
import { Record, RecordTypeEnum } from 'src/app/models/records';  // Assure-toi d'importer le bon modèle
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  generatePDF(): void {
    const element = this.pdfContent.nativeElement;
    html2canvas(this.pdfContent.nativeElement, { useCORS: true, scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('historique_medical.pdf');
    });
    
  }



retour() {
this.router.navigate(['/medicalnotebook']);}


  deleteRecord(record: any): void {
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
  
  constructor(
    private route: ActivatedRoute,
    private medicalRecordService: MedicalService,
    private router: Router, // <== Ajoute ceci

  ) {}
name: any;

medicalRecords: any[] = [];
editRecord(record: any): void {
  // Log de l'objet cliqué
  console.log('Enregistrement reçu pour édition :', record);
  console.log('ID reçu pour édition (via paramètre) :', record.id);

  // On récupère tous les enregistrements pour s'assurer que le record existe bien
  this.medicalRecordService.getAllRecords().subscribe({
    next: (records) => {
      this.medicalRecords = records;
      console.log('Enregistrements récupérés :', this.medicalRecords);

      // Rechercher dans la liste le record correspondant à celui qu'on veut éditer
      const recordToEdit = this.medicalRecords.find(r => r.id == record.id);

      
        this.router.navigate(['/editrecord', recordToEdit.id]);
      
        console.error('Record non trouvé dans la liste.');
      
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des enregistrements', err);
    }
  });
}

Records = [/* Ton tableau de données de records */];
Name = "Nom du Carnet"; // Exemple de nom du carnet

// Méthode pour exporter en PDF
/*exportToPDF(): void {
  const recordsContainer = document.querySelector('.Records-container') as HTMLElement; 

  if (recordsContainer) {
    // Utilisation de html2canvas pour capturer l'élément HTML
    html2canvas(recordsContainer).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Création du PDF avec jsPDF
      const doc = new jsPDF();
      doc.addImage(imgData, 'PNG', 10, 10, 180, 160); // Ajouter l'image capturée au PDF

      // Sauvegarde du fichier PDF
      doc.save(`${this.Name}-historique.pdf`);
    });
  }
}*/



  
  carnetId!: number;
  carnetname!: string;

  records: any[] = [];
  record: any[] = [];
 

  ngOnInit(): void {
    this.carnetId = +this.route.snapshot.paramMap.get('id')!;
    this.carnetname = this.route.snapshot.paramMap.get('name')!;
  
    this.loadMedicalRecords();
  }
  loadRecordById(record: any): void {
    const recordId = record?.id || record?._id || record?.recordId;
  
    if (!recordId) {
      console.error("❌ ID du record manquant ou record invalide:", record);
      return;
    }
  
    this.medicalRecordService.getMedicalRecordById(recordId).subscribe({
      next: (data) => {
        console.log("✅ Record récupéré avec succès :", data);
        this.record = data;
      },
      error: (err) => {
        console.error("❌ Erreur lors de la récupération du record :", err);
      }
    });
  }
  

loadMedicalRecords() {
  this.medicalRecordService.getMedicalRecordsByCarnetId(this.carnetId).subscribe(data => {
    console.log('DATA REÇUE : ', data);

    this.records = data.medicalRecords.map((record: any) => {
      console.log("Record reçu :", record);
      // Remap `_id` to `id` if necessary
      if (record._id && !record.id) {
        record.id = record._id;
      }
      return record;
    });

    this.name = data.name;
  });
}
}
