import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { MedicalService } from '../Services/medical.service';
import { FullCarnetResponse, Record } from '../models/records';
import OpenAI from "openai";
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
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


  poidsList: number[] = [];
typeList: string[] = [];
  constructor(private carnetService: MedicalService, private rt: Router) {}

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
      const records = response.medicalRecords;
  
      // ➕ Construction des données pour le graphique
      const poidsData = records
        .filter((record: Record) =>
          record.poids > 0 &&
          record.dateTime &&
          !isNaN(new Date(record.dateTime).getTime())
        )
        .map((record: Record) => ({
          date: new Date(record.dateTime!).toLocaleDateString(),
          poids: record.poids
        }));
  
      // ✅ Extraire les listes poids et type
this.poidsList = records.map(record => record.poids).filter(p => p !== null && p !== undefined);
this.typeList = records.map(record => record.type).filter(t => !!t);

console.log('Poids List:', this.poidsList);
console.log('Type List:', this.typeList);

  
      // Graphique
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
  
  retour(){
    this.rt.navigate(['/medicalnotebook']);
  }


 private apiKey = environment.apiKey;

 
   client = new OpenAI({
    baseURL: environment.baseURL,
    apiKey: this.apiKey,
    dangerouslyAllowBrowser: true,
  });
 

  responseHistory: string [] = [];
  isLoading: boolean = false;

  async askQuestion(prompt: string){
    const poidsData = this.poidsList.join(', ');
    const typeData = this.typeList.join(', ');
  
    const fullPrompt = `
      Pet weight history: [${poidsData}]
      Consultation types: [${typeData}]
      Generate a coherent and well-structured paragraph in English (no bullet points, no headings). Use only valid and non-null data. 
      Analyze the evolution of the pet's weight and the types of consultations. Based on this analysis, provide concise recommendations,
      including dietary suggestions and future care habits to adopt for the pet’s health and well-being.
    `;
  
    this.responseHistory.push(prompt); // ✅ Affiche uniquement ce que l’utilisateur tape
  
    const response = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: "" },
        { role: "user", content: fullPrompt } // 🟡 Utilise le prompt complet uniquement pour GPT
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    }).then((response) => {
      this.responseHistory.push(response.choices[0].message.content ?? '');
      this.isLoading = false; 
    });
  
    const raw = await response;
    return null;
  }
  

  isChatMinimized: boolean = false;

  toggleChat() {
    this.isChatMinimized = !this.isChatMinimized;
  }
  
   
    getPoidsAndTypeList(carnetId: number): { poidsList: number[], typeList: string[] } {
      const selectedCarnet = this.carnets.find(c => c.id === carnetId);
      if (selectedCarnet) {
        const poidsList = selectedCarnet.records.map((record: { poids: any; }) => record.poids);
        const typeList = selectedCarnet.records.map((record: { type: any; }) => record.type);
        return { poidsList, typeList };
      } else {
        return { poidsList: [], typeList: [] };
      }
    }
  
    // ✅ Exemple d'appel de cette fonction pour utiliser les listes
    onSelectCarnet(carnetId: number): void {
      this.selectedCarnetId = carnetId;
      const { poidsList, typeList } = this.getPoidsAndTypeList(carnetId);
      console.log('Poids List:', poidsList);
      console.log('Type List:', typeList);
    }




}