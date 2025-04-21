import  { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

private apiUrl = 'http://localhost:8222/api/appointments/';
  constructor( private http:HttpClient) { }

  getAppointments() : Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl +'findAllAppointments');
  }

  getAppointmentById(id:number): Observable<any>{
    return this.http.get<any>(this.apiUrl +'findAppointmentById/'+ id);
  }

  getAppointmentsByProviderId(providerId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/service/' + providerId);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + 'deleteAppointment/' + id);
  }

  getAppointmentsByUserId(idOwner: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/owner/' + idOwner);
  }

  getNearestAppointmentByUserId(idOwner: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/nearest/' + idOwner);
  }

}
