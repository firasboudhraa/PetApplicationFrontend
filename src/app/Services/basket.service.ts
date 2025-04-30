import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{ Basket } from '../models/basket'; 
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private baseUrl = 'http://localhost:8013/api/baskets';

  constructor(private http: HttpClient) {}

  // basket.service.ts
getAllUserIds(): Observable<number[]> {
  return this.http.get<number[]>('/api/users/ids'); // adapte l’URL selon ton backend
}


  getAllBaskets(): Observable<Basket[]> {
    return this.http.get<Basket[]>(this.baseUrl);
  }

  getAllBasketsByUser(userId: number): Observable<Basket[]> {
    return this.http.get<Basket[]>(`${this.baseUrl}/user/${userId}`);
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

  // Dans basket.service.ts
getProductsByBasketId(basketId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.baseUrl}/${basketId}/products`);
}

addProductToBasketbyUser(userId: number, basketId: number, productId: number): Observable<Basket> {
  return this.http.post<Basket>(`${this.baseUrl}/user/${userId}/${basketId}/add-product/${productId}`, {});
}
    // Ajouter un produit au panier
    addProductToBasket(basketId: number, productId: number): Observable<Basket> {
      return this.http.post<Basket>(`${this.baseUrl}/${basketId}/add-product/${productId}`, {});
    }
  
    // Supprimer un produit du panier
    removeProductFromBasket(basketId: number, productId: number): Observable<Basket> {
      return this.http.post<Basket>(`${this.baseUrl}/${basketId}/remove-product/${productId}`, {});
    }
  
    // Vider le panier
    clearBasket(basketId: number): Observable<Basket> {
      return this.http.put<Basket>(`${this.baseUrl}/clear/${basketId}`, {});
    }


    
}
