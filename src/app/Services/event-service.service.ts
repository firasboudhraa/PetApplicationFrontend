import  { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { Observable } from 'rxjs';

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

}
