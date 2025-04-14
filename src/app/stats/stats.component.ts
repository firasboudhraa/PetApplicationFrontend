import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { MedicalService } from '../Services/medical.service';
import { FullCarnetResponse, Record } from '../models/records';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  carnets: FullCarnetResponse[] = [];
  selectedCarnetId: number | null = null;
  lineChartData: ChartConfiguration<'line'>['data'] | undefined;
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true
  };

  constructor(private carnetService: MedicalService) {}

  ngOnInit(): void {
    this.loadCarnets(); // 🔁 Charger tous les carnets au démarrage
  }

  loadCarnets(): void {
    this.carnetService.getAllCarnets().subscribe((data: any[]) => {
      this.carnets = data as FullCarnetResponse[];
    });
  }    

  onCarnetSelected(): void {
    if (this.selectedCarnetId === null) return;

    this.carnetService.getMedicalRecordsByCarnetId(this.selectedCarnetId).subscribe((response: FullCarnetResponse) => {
      const poidsData = response.medicalRecords
        .filter((record: Record) =>
          record.poids > 0 &&
          record.dateTime &&
          !isNaN(new Date(record.dateTime).getTime())
        )
        .map((record: Record) => ({
          date: new Date(record.dateTime!).toLocaleDateString(),
          poids: record.poids
        }));

      if (poidsData.length > 0) {
        this.lineChartData = {
          labels: poidsData.map(p => p.date),
          datasets: [
            {
              label: 'Poids (kg)',
              data: poidsData.map(p => p.poids),
              borderColor: '#4e73df',
              backgroundColor: 'rgba(78, 115, 223, 0.2)',
              tension: 0.4
            }
          ]
        };
      } else {
        this.lineChartData = undefined;
      }
    });
  }
}
