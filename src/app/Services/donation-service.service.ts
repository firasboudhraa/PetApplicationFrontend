import  { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import type { Donation } from '../models/donation';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  private apiUrl = 'http://localhost:8010/donation/';
  private badgeCache = new Map<number, string>();
  
  constructor( private http:HttpClient, private userService: UserService) { }

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

  getBadgeLevels(): Observable<any> {
    return this.http.get(`${this.apiUrl}badge-levels`);
  }

getUserTopBadge(userId: number): Observable<string> {
  if (this.badgeCache.has(userId)) {
    return of(this.badgeCache.get(userId)!);
  }

  return this.http.get(`${this.apiUrl}user/${userId}/top-badge`, { 
    responseType: 'text' 
  }).pipe(
    catchError(error => {
      console.error('Error getting top badge:', error);
      return of('New Donor');
    }),
    tap(badge => this.badgeCache.set(userId, badge))
  );
}

getTopDonors(limit: number = 5): Observable<{user: {id: number, name: string}, total: number}[]> {
  return this.http.get<Donation[]>(`${this.apiUrl}retrieve-all-donations`).pipe(
    switchMap(donations => {
      // Grouper les donations par utilisateur
      const userTotals = new Map<number, number>();
      
      donations
        .filter(d => d.status === 'COMPLETED')
        .forEach(d => {
          const current = userTotals.get(d.userId) || 0;
          userTotals.set(d.userId, current + d.amount);
        });

      // Convertir en tableau et trier
      const sortedDonors = Array.from(userTotals.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

      // Extraire les IDs des utilisateurs
      const userIds = sortedDonors.map(([userId]) => userId);

      // Récupérer les noms des utilisateurs
      return this.userService.getUsersByIds(userIds).pipe(
        map(users => {
          return sortedDonors.map(([userId, total]) => ({
            user: users.find(u => u.id === userId) || {id: userId, name: `User ${userId}`},
            total
          }));
        })
      );
    })
  );
}

}