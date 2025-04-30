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
  getAllMadeByUser(userId:number):Observable<PetSittingOffer[]> {
    return this.http.get<PetSittingOffer[]>(`${this.apiUrl}/getAllMadeByUser/${userId}`)
  }
  savePetSittingOffer(petSittingOffer: PetSittingOffer): Observable<PetSittingOffer> {
    return this.http.post<PetSittingOffer>(`${this.apiUrl}`, petSittingOffer);
  }
  getAvailablePetSittingOffers(userId : number): Observable<PetSittingOffer[]> {
    return this.http.get<PetSittingOffer[]>(`${this.apiUrl}/AvailableOffers/${userId}`);
  }
  requestPetSittingOffer(offerId: number, sitterId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${offerId}/request/${sitterId}`,{});
  }
  getReceivedPetSittingOffers(userId: number): Observable<PetSittingOffer[]> {
    return this.http.get<PetSittingOffer[]>(`${this.apiUrl}/receivedRequests/${userId}`);
  }
  getSentPetSittingOffers(userId: number): Observable<PetSittingOffer[]> {
    return this.http.get<PetSittingOffer[]>(`${this.apiUrl}/sentRequests/${userId}`);
  }
  confirmPetSittingOffer(offerId: number, requesterId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${offerId}/confirm/${requesterId}`, {});
  }
  rejectPetSittingOffer(offerId: number, requesterId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${offerId}/reject/${requesterId}`, {});
  }
  cancelPetSittingOffer(offerId: number,sitterId:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${offerId}/cancel/${sitterId}`);
  }
  deleteOffer(offerId:number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/delete/${offerId}`)
  }
}
