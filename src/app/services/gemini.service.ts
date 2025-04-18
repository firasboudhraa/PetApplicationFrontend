import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Configuration initiale - EN PROD, utilisez des variables d'environnement
    this.genAI = new GoogleGenerativeAI('AIzaSyDpzYkOOebvdY2pLKZwUm_uSkWR0OPqoZg');
   
    // Configuration du modèle (version la plus stable)
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest"  // Modèle le plus récent
    });
  }

  // Nouvelle méthode pour vérifier les modèles disponibles
  async getAvailableModels(): Promise<any[]> {
    try {
      const client = await this.genAI.getGenerativeModel({ model: "gemini-pro" });
      // Alternative si listModels() n'est pas disponible
      return [
        { name: "gemini-1.5-pro-latest" },
        { name: "gemini-1.0-pro" },
        { name: "gemini-pro" }
      ];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      // Version avec gestion de timeout
      const result = await Promise.race([
        this.model.generateContent(prompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout after 30s')), 30000)
        )
      ]);
     
      // @ts-ignore (ignore le typage temporairement)
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Generation error:', error);
      throw new Error(`Erreur Gemini: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}