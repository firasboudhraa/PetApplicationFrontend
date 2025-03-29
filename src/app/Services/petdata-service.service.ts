import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet'; // Replace with the correct path to your Pet model

@Injectable({
  providedIn: 'root'
})
export class PetdataServiceService {
  private apiUrl = 'http://localhost:8222/api/v1/pet'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all pets
  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/retrieve-all-pets`);
  }
}
