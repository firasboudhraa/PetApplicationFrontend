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

  updateService(s: PetService): Observable<PetService> {
    return this.http.put<PetService>(this.apiUrl + 'update-service', s);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + 'delete-service/' + id);
  }

  getServiceWithAppointments(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'with-appoitments/' + id);
  }

  confirmAppointment(id: number, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/with-appointments/${id}/accept`, { reason});
  }

  rejectAppointment(id: number, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/with-appointments/${id}/reject`, { reason });
  }

  getServicesWithAppointmentsByProviderId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}with-appoitments/provider/${id}`);
  }

}
