import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import OpenAI from "openai";
import { Observable } from 'rxjs';
import { MedicalService } from '../Services/medical.service';
import { FullCarnetResponse } from '../models/records';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.css']
})

export class ChatAIComponent implements OnInit {
  @Input() liste!: number;
  carnets: FullCarnetResponse[] = [];
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient,private carnetService:MedicalService) {}
  ngOnInit(): void {
    console.log("liste",this.liste);
  }
   client = new OpenAI({
    baseURL: environment.baseURL,
    apiKey: this.apiKey,
    dangerouslyAllowBrowser: true,
  });
 
  async askQuestion(prompt: string){
      prompt+= "Generate a coherent paragraph in English (no bullet points, no introduction). Use only real data, ignore null values, and briefly provide recommendations based on the evolution of weight and types of consultations."
      const response = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: "" },
          { role: "user", content: prompt }
        ],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1
      }).then((response) => {
        console.log(response.choices[0].message.content);
      })
     
        const raw = await response
      // Affiche immédiatement toute la réponse
 
      // Test : afficher la réponse après 1 seconde
 
  return null
  }
   loadCarnets(): void {
      this.carnetService.getAllCarnets().subscribe((data: any[]) => {
        this.carnets = data as FullCarnetResponse[];
      });
    } 
    selectedCarnetId: string = '';
    getPoidsAndTypeList(carnetId: string): { poidsList: number[], typeList: string[] } {
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
    onSelectCarnet(carnetId: string): void {
      this.selectedCarnetId = carnetId;
      const { poidsList, typeList } = this.getPoidsAndTypeList(carnetId);
      console.log('Poids List:', poidsList);
      console.log('Type List:', typeList);
    }
}