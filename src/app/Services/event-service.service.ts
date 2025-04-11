import  { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { Observable } from 'rxjs';
import { Event as AppEvent } from '../models/event'; // Même alias ici

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:8015/event/';
  constructor( private http:HttpClient) { }

  getEvents() : Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl +'retrieve-all-events');
  }

  getEventById(id:number): Observable<any>{
    return this.http.get<any>(this.apiUrl +'with-events/'+ id);
  }

  addEvent(event: AppEvent): Observable<Event> {
    return this.http.post<Event>(this.apiUrl + 'add-event', event);
  }

  updateEvent(id: number, event: AppEvent): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}modify-event`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}remove-event/${id}`);
  }

}
