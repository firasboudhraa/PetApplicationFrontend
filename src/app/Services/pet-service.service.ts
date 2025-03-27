import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetServiceService {

 private apiUrl = 'http://localhost:8222/api/services/all-services';
  constructor( private http:HttpClient) { }

  getServices() : Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
