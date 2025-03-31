import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet'; 

@Injectable({
  providedIn: 'root'
})
export class PetdataServiceService {
  private apiUrl = 'http://localhost:8222/api/v1/pet'; 

  constructor(private http: HttpClient) {}

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/retrieve-all-pets`);
  }
  getPetsByOwnerId(id: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/${id}`);
  }
  addPet(pet: FormData): Observable<any> {
    return this.http.post<Pet>(`${this.apiUrl}/addPet`, pet);
  }
  removePet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-pet/${id}`);
  }
  updatePet(id: number, pet: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/modify-pet?id=${id}`, pet);
  }
}
