import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet'; 

@Injectable({
  providedIn: 'root'
})
export class PetdataServiceService {
  private apiUrl = 'http://localhost:8222/api/v1/pet'; 
  private catDogsModelUrl = 'http://localhost:8052'; 
  private birdsModelUrl = 'http://localhost:8053'; 
  private  aiUrl!:string ; 

  constructor(private http: HttpClient) {}
  
  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/retrieve-all-pets`);
  }
  getPetById(petId: number): Observable<Pet>{
    return this.http.get<Pet>(`${this.apiUrl}/retrieve-pet/${petId}`)
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

  discoverBreed(imageUrl:string, specie:string): Observable<any> {
    if (specie.toLowerCase() == 'cat' || specie.toLowerCase() == 'dog') this.aiUrl= this.catDogsModelUrl ;
    else if (specie.toLowerCase() == 'bird') this.aiUrl = this.birdsModelUrl;
    return this.http.post<any>(`${this.aiUrl}/predict-from-url`, { image_url: imageUrl });
  }
}
