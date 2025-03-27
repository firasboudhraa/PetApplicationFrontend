import  { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { Observable } from 'rxjs';
import type { PetService } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class PetServiceService {

  private apiUrl = 'http://localhost:8222/api/services/';
  constructor( private http:HttpClient) { }

  getServices() : Observable<PetService[]>{
    return this.http.get<PetService[]>(this.apiUrl+'all-services');
   }

  getServiceById(id:number): Observable<PetService>{
    return this.http.get<PetService>(this.apiUrl+'service/'+id);
  }

  getAvailableSlots(id:number): Observable<string[]>{
    return this.http.get<string[]>(this.apiUrl+id+'/slots');
  }

  addService(s:PetService): Observable<PetService>{
    return this.http.post<PetService>(this.apiUrl+'add-service', s);
  }

}
