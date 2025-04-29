import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8011/api/products';   

  constructor(private http: HttpClient) {}

  // Récupérer tous les produits
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  // Récupérer un produit par son ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}`, product);
  }

  // Créer un produit
  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}`, productData);
  }
    // Récupérer le nom du produit
    getProductName(productId: number): Observable<string> {
      return this.http.get<string>(`${this.baseUrl}/${productId}/name`);
    }
  
    // Récupérer le prix du produit
    getProductPrice(productId: number): Observable<number> {
      return this.http.get<number>(`${this.baseUrl}/${productId}/price`);
    }
  
    // Récupérer l'image du produit
    getProductImage(productId: number): Observable<string> {
      return this.http.get<string>(`${this.baseUrl}/${productId}/image`);
    }

  // Mettre à jour un produit
  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  } 

  // Supprimer un produit
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Récupérer les produits par marketplaceId
  getProductsByMarketplaceId(marketplaceId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/${marketplaceId}/products`);
  }

  increaseQuantityBackend(id: number) {
    return this.http.put<Product>(`${this.baseUrl}/${id}/increase`, {});
  }
  
  decreaseQuantityBackend(id: number) {
    return this.http.put<Product>(`${this.baseUrl}/${id}/decrease`, {});
  }

 // Récupérer les produits par ID utilisateur
getProductsByUserId(userId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.baseUrl}/user/${userId}`);
}
// Récupérer les produits par ID utilisateur

  // Ajouter un produit (par utilisateur)
  addProductByUser(userId: number, formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/user/${userId}`, formData);
  }

  // Modifier un produit (par utilisateur)
  updateProductByUser(userId: number, productId: number, productData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/user/${userId}/product/${productId}`, productData);
  }

  // Supprimer un produit (par utilisateur)
  deleteProductByUser(userId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${userId}/product/${productId}`);
  }


}
