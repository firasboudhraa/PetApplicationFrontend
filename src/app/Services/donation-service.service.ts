import  { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { Observable } from 'rxjs';
import type { Donation } from '../models/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  private apiUrl = 'http://localhost:8010/donation/';
  constructor( private http:HttpClient) { }

  getDonations() : Observable<Donation[]>{
    return this.http.get<Donation[]>(this.apiUrl+'retrieve-all-donations');
   }

  getDonationById(id:number): Observable<Donation>{
    return this.http.get<Donation>(this.apiUrl+'retrieve-donation/'+id);
  }

  addDonation(d:Donation): Observable<Donation>{
    return this.http.post<Donation>(this.apiUrl+'add-donation', d);
  }

  updateDonation(d: Donation): Observable<Donation> {
    return this.http.put<Donation>(this.apiUrl + 'modify-donation', d);
  }

  deleteDonation(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + 'remove-donation/' + id);
  }

  getDonationsByUserAndEvent(userId: number, eventId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'user/' + userId + '/event/' + eventId);
  }

}
