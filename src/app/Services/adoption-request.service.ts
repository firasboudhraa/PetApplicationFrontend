import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdoptionRequest } from '../models/adoptionRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdoptionRequestService {

  private apiUrl = 'http://localhost:8222/api/v1/adoptionRequest'; 

  constructor(private http: HttpClient) {}

  saveAdoptionRequest(adoptionRequest: AdoptionRequest): Observable<AdoptionRequest> {
    return this.http.post<AdoptionRequest>(`${this.apiUrl}`, adoptionRequest);
  }
  getAdoptionRequests(requesterUserId:number): Observable<AdoptionRequest[]> {
    return this.http.get<AdoptionRequest[]>(`${this.apiUrl}/requester/${requesterUserId}`);
  }
  getReceivedAdoptionRequest(ownerId:number):Observable<AdoptionRequest[]>{
    return this.http.get<AdoptionRequest[]>(`${this.apiUrl}/owner/${ownerId}`);
  }
  deleteAdoptionRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  
  }
  confirmAdoptionRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/confirm/${id}`, {});
  }
}

