import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PetSittingOffer } from '../models/petSittingOffer';

@Injectable({
  providedIn: 'root'
})
export class PetSittingOfferService {

  private apiUrl = 'http://localhost:8222/api/v1/petSittingOffer'; 

  constructor(private http: HttpClient) {}

  savePetSittingOffer(petSittingOffer: PetSittingOffer): Observable<PetSittingOffer> {
    return this.http.post<PetSittingOffer>(`${this.apiUrl}`, petSittingOffer);
  }
  getAvailablePetSittingOffers(userId : number): Observable<PetSittingOffer[]> {
    return this.http.get<PetSittingOffer[]>(`${this.apiUrl}/AvailableOffers/${userId}`);
  }
}
