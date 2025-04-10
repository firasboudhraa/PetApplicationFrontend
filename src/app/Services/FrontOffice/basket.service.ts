import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Basket {
  id_Basket?: number;
  dateCreation?: string;
  statut: string;
  total: number;
  modePaiement: string;
  dateValidation?: string;
  dateModification?: string;
  productIds: number[];
}

@Injectable({
  providedIn: 'root'
})

export class BasketService {
  private baseUrl = 'http://localhost:8012/api/baskets';

  constructor(private http: HttpClient) {}

  getAllBaskets(): Observable<Basket[]> {
    return this.http.get<Basket[]>(this.baseUrl);
  }

  getBasketById(id: number): Observable<Basket> {
    return this.http.get<Basket>(`${this.baseUrl}/${id}`);
  }

  createBasket(basket: Basket): Observable<Basket> {
    return this.http.post<Basket>(this.baseUrl, basket);
  }

  updateBasket(id: number, basket: Basket): Observable<Basket> {
    return this.http.put<Basket>(`${this.baseUrl}/${id}`, basket);
  }

  deleteBasket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  clearBasket(id: number): Observable<Basket> {
    return this.http.delete<Basket>(`${this.baseUrl}/${id}/clear`);
  }

  // Nouvelle méthode pour supprimer un produit du panier
  removeProductFromBasket(basketId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${basketId}/products/${productId}`);
  }
}
