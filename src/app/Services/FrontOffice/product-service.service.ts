import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8011/api/products';

  constructor(private http: HttpClient) {}

  // Récupérer la liste des produits
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Récupérer un produit par son ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Créer un produit en envoyant des données de formulaire
  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, formData);
  }

  // Mettre à jour un produit avec ses données
  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Supprimer un produit en fonction de son ID
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un produit à un panier
  addProductToBasket(basketId: number, productId: number): Observable<any> {
    const url = `${this.apiUrl}/${basketId}/products/${productId}`;
    return this.http.post<any>(url, {});
  }

  // Récupérer l'image du produit
  getProductImage(productId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${productId}/image`);
  }

  // Récupérer le nom du produit
  getProductName(productId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${productId}/name`);
  }

  // Récupérer le prix du produit
  getProductPrice(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${productId}/price`);
  }
}
