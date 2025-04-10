import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product'; // Importation de la classe Product

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  private apiUrl = 'http://localhost:8010/api/products';

  constructor(private http: HttpClient) {}

  // Récupérer tous les produits
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  // Récupérer un produit par son ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Créer un produit avec FormData (pour gérer les images et les autres données)
  createProductWithFormData(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, formData);
  }

  // Mettre à jour un produit avec FormData
  updateProductWithFormData(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
  }

  // Créer un produit (ancienne méthode sans FormData)
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, product);
  }

  // Mettre à jour un produit (ancienne méthode sans FormData)
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product); // Utiliser `id` au lieu de `id_Product`
  }

  // Supprimer un produit
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
}
