import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentResponse } from '../models/payment-response'; 
import { Payment,PaymentRequest } from '../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private baseUrl = 'http://localhost:8014/api/payment'; // adapte si nécessaire

  constructor(private http: HttpClient) {}

  createPayment(payment: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.baseUrl}/create`, payment);
  }

  getAllPayments(): Observable<PaymentRequest[]> {
    return this.http.get<PaymentRequest[]>(this.baseUrl);
  }

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  updatePayment(paymentId: number, payment: Payment): Observable<Payment> {
    const url = `${this.baseUrl}/update/${paymentId}`;
    return this.http.put<Payment>(url, payment);
  }

  // Supprimer un paiement
  deletePayment(paymentId: number): Observable<any> {
    const url = `${this.baseUrl}/delete/${paymentId}`;
    return this.http.delete(url);
  }

  getPaymentById(id: number): Observable<PaymentRequest> {
    return this.http.get<PaymentRequest>(`${this.baseUrl}/${id}`);
  }

  // payment.service.ts
updatePaymentStatus(paymentId: number, status: string) {
  return this.http.put<void>(`${this.baseUrl}/${paymentId}/status`, null, {
    params: { status }
  });
}

updateBasketStatus(basketId: number): Observable<void> {
  // On appelle le bon endpoint dans l'API Spring Boot pour valider le panier
  return this.http.put<void>(`http://localhost:8013/api/baskets/${basketId}/validate`, {});
}

// In your PaymentService
getPaymentHistory(url: string): Observable<Payment[]> {
  return this.http.get<Payment[]>(url);  // Adjust based on your API
}


}