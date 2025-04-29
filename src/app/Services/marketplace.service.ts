import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marketplace } from '../models/marketplace';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private apiUrl = 'http://localhost:8016/api/marketplaces';

  constructor(private http: HttpClient) {}

  getAllMarketplaces(): Observable<Marketplace[]> {
    return this.http.get<Marketplace[]>(`${this.apiUrl}`);
  }

  getMarketplaceById(id: number): Observable<Marketplace> {
    return this.http.get<Marketplace>(`${this.apiUrl}/${id}`);
  }

  createMarketplace(marketplace: Marketplace): Observable<Marketplace> {
    return this.http.post<Marketplace>(`${this.apiUrl}`, marketplace);
  }
  

  updateMarketplace(id: number, marketplace: Marketplace): Observable<Marketplace> {
    return this.http.put<Marketplace>(`${this.apiUrl}/${id}`, marketplace);
  }

  deleteMarketplace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  deleteAllProductsByMarketplaceId(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/products`);
  }
}
