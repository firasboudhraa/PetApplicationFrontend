import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Carnet } from '../models/carnet';

@Injectable({
  providedIn: 'root'
})
export class MedicalService {

  private baseUrl = 'http://localhost:8070/api/carnet';
  private baseUrl1 = 'http://localhost:8071/api/medicalrecord';


  constructor(private http: HttpClient) {}

  // 🔹 Récupère tous les carnets seuls
  getAllCarnets(): Observable<Carnet[]> {
    return this.http.get<Carnet[]>(`${this.baseUrl}/retrieve-all-carnets`);
  }

  // 🔹 Récupère les records d’un carnet spécifique
  getMedicalRecordsByCarnetId(carnetId: number): Observable<Record<string, any>[]> {
    return this.http.get<Record<string, any>[]>(`${this.baseUrl}/${carnetId}/medical-records`);
  }
    // 🔹 Crée un nouveau carnet
  createCarnet(carnet: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-carnet`, carnet);
  }
  createMedicalRecord(record: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl1}/add-medicalRecord`, record);
  }
  
  /*getCarnetsWithRecords(): Observable<Carnet[]> {
    return this.getAllCarnets().pipe(
      switchMap((carnets: Carnet[]) =>
        forkJoin(
          carnets.map(carnet =>
            this.getMedicalRecordsByCarnetId(carnet.id).pipe(
              map((records: Record<string, any>[]) => ({
                ...carnet,
                medicalHistory: records
              } as Carnet)) // <-- Cast explicite ici
            )
          )
        )
      )
    );
  }*/


  /** 🔹 Récupérer tous les animaux */
  getAllPets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pets`);
  }

 

  /** 🔹 Récupérer un carnet par ID */
  getCarnetById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/carnets/${id}`);
  }

  /** 🔹 Ajouter un carnet */
  addCarnet(carnet: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/carnets`, carnet);
  }

  /** 🔹 Mettre à jour un carnet */
  updateCarnet(carnet: any, id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/carnets/${id}`, carnet);
  }

  /** 🔹 Ajouter un record */
  addRecord(record: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/records`, record);
  }

   
  
 
  
   
  
    // Supprimer un carnet médical
    deleteCarnet(id: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/carnet/${id}`);
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
