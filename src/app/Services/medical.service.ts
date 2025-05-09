import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, switchMap, throwError } from 'rxjs';
import { Carnet } from '../models/carnet';
import { FullCarnetResponse } from '../models/records';

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


  getAllRecords(): Observable<Record<string, any>[]> {
    return this.http.get<Record<string, any>[]>(`${this.baseUrl1}/retrieve-all-medicalRecords`);
  }

  // 🔹 Récupère les records d’un carnet spécifique
  getMedicalRecordsByCarnetId(carnetId: number): Observable<FullCarnetResponse> {
    return this.http.get<FullCarnetResponse>(`${this.baseUrl}/${carnetId}/medical-records`);
  }
  
    // 🔹 Crée un nouveau carnet
  createCarnet(carnet: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-carnet`, carnet);
  }
  NewcreateMedicalRecord(record: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8071/api/medicalrecord/add-medicalRecord`, record);
  }
  createMedicalRecord(record: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl1}/add-medicalRecord`, record);
  }

  createMedicalRecordWithFile(record: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl1}/New-add-medicalRecord`, record);
  }
  updateMedicalRecord(id: number, updatedRecord: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl1}/update/${id}`, updatedRecord);
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

  
  getMedicalRecordById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl1}/retrieve-medicalRecord/${id}`);
  }
 /*
  addMedicalRecord(Record: any): Observable<Record<string, any>[]> {
    // Ne pas définir le Content-Type manuellement, Angular le gère automatiquement avec FormData
    return this.http.post<Record<string, any>[]>(`${this.baseUrl1}/add-medicalRecord`, Record);
  }*/
    addMedicalRecord(record: FormData): Observable<any> {
      return this.http.post<Record<string, any>[]>(`${this.baseUrl1}/add-medicalRecord`, record)
    }
  
 
  
  deleteCarnet(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove-carnet/${id}`);
  }
  deleteMedicalRecord(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl1}/remove-medicalRecord/${id}`);
  }
  
  
  


}
