import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // pour les clics
import { MedicalService } from '../Services/medical.service';
import { FullCarnetResponse, Record } from '../models/records';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
retour() {
this.rt.navigate(['/medicalnotebook']);}
  carnets: any[] = [];
  selectedCarnetId: number | null = null;
  medicalRecords: Record[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    },
    events: [],
    locale: 'fr',
    eventDisplay: 'block'
  };

  constructor(private carnetService: MedicalService,private rt:Router) {}

  ngOnInit(): void {
    this.loadCarnets();
  }

  loadCarnets(): void {
    this.carnetService.getAllCarnets().subscribe((data: any[]) => {
      this.carnets = data as FullCarnetResponse[];
    });
  }


  

  onCarnetSelected(): void {
    if (this.selectedCarnetId === null) return;

    console.log('ID du carnet sélectionné:', this.selectedCarnetId);

    this.carnetService.getMedicalRecordsByCarnetId(this.selectedCarnetId).subscribe(
      (response: FullCarnetResponse) => {
        console.log('Réponse de l\'API:', response);

        this.medicalRecords = response.medicalRecords.filter(record =>
          record.dateTime &&
          record.next_due_date &&
          !isNaN(new Date(record.dateTime).getTime()) &&
          !isNaN(new Date(record.next_due_date).getTime())
        );

        const events = this.medicalRecords.flatMap(record => {
          const evtList = [];

          // 🩺 Consultation
          evtList.push({
            title: `🩺 ${record.type || 'Consultation'}`,
            date: record.dateTime,
            color: '#007bff'
          });

          // 🔁 Prochaine consultation
          evtList.push({
            title: `🔁 Suivi`,
            date: record.next_due_date,
            color: '#28a745'
          });

          return evtList;
        });

        this.calendarOptions.events = events;

        console.log('Événements pour le calendrier:', events);
      },
      error => {
        console.error('Erreur lors de la récupération des records:', error);
      }
    );
  }
}
