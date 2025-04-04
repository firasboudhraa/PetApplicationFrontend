import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Carnet } from '../models/carnet';

@Injectable({
  providedIn: 'root'
})
export class MedicalService {

  private apiUrl = 'http://localhost:3000'; // Modifie avec ton URL d’API

  constructor(private http: HttpClient) {}

  /** 🔹 Récupérer tous les animaux */
  getAllPets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pets`);
  }

  /** 🔹 Récupérer tous les carnets */
  getAllCarnets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/carnets`);
  }

  /** 🔹 Récupérer un carnet par ID */
  getCarnetById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/carnets/${id}`);
  }

  /** 🔹 Ajouter un carnet */
  addCarnet(carnet: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/carnets`, carnet);
  }

  /** 🔹 Mettre à jour un carnet */
  updateCarnet(carnet: any, id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/carnets/${id}`, carnet);
  }

  /** 🔹 Ajouter un record */
  addRecord(record: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/records`, record);
  }

  /*constructor(private http : HttpClient) { }
  private carnets: any[] = [];  // Stockage des carnets
  private records: any[] = [];  // Stockage des records


  // Ajouter un carnet
  addCarnet(carnet: any) {
    this.carnets.push(carnet);
  }

  // Récupérer les carnets
  getCarnets(): Observable <Carnet[]>  {
    return this.http.get<Carnet[]>('http://localhost:3000/api/carnets');
  }

  // Ajouter un record
  addRecord(record: any) {
    this.records.push(record);
  }

  // Récupérer les records
  getRecords() {
    return this.records;
  }*/

}
