import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { PaymentService } from '../../../Services/payment.service';
import { PaymentRequest } from '../../../models/payment';
import { PaymentResponse } from '../../../models/payment-response'; 
import { BasketService } from '../../../Services/basket.service'; 
import { Basket } from '../../../models/basket';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-payment',
  templateUrl: './form-payment.component.html',
  styleUrls: ['./form-payment.component.css']
})
export class PaymentComponent implements OnInit {
  stripePromise = loadStripe('pk_test_51RG5dVH61SNP6XKN6cK5IKZ2dcQvc8bJ0kbdZGQuT4RDpv4QbLkTefVO1z9Bq1s6ThOChspqdiH3yvaikJh8okNI00dn1FFvVr');
  elements!: StripeElements;
  card!: StripeCardElement;

  userId: number = 1;    
  basketId: number = 1;    
  total: number = 0;      
  basket?: Basket;         

  constructor(private paymentService: PaymentService, private basketService: BasketService) {}

  async ngOnInit() {
    this.basketService.getBasketById(this.basketId).subscribe(basket => {
      this.basket = basket;
      this.total = basket.total;
      console.log("🧺 Basket reçu:", basket);
      console.log("💰 Total mis à jour:", this.total);
    });
    const stripe = await this.stripePromise;
    if (stripe) {
      this.elements = stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    }

  }

  async payNow() {
    const request: PaymentRequest = {
      basketDTO: {
        ...this.basket!,
        id_Basket: this.basketId,
        total: this.total,
        dateCreation: new Date().toISOString(),
        statut: 'EN_ATTENTE',
        quantity: this.basket?.quantity || 1,
        modePaiement: 'stripe',
        dateValidation: null,
        dateModification: null,
        userId: this.userId,
        productIds: []
      },
      userDTO: { id_User: this.userId }
    };
  
    this.paymentService.createPayment(request).subscribe(async (res: PaymentResponse) => {
      const stripe = await this.stripePromise;
      if (stripe && this.card) {
        const result = await stripe.confirmCardPayment(res.clientSecret, {
          payment_method: {
            card: this.card,
            billing_details: { name: 'Client test' }
          }
        });
  
        if (result.error) {
          Swal.fire({ icon: 'error', title: 'Erreur de paiement', text: result.error.message });
        } else if (result.paymentIntent?.status === 'succeeded') {
          Swal.fire({ icon: 'success', title: 'Paiement réussi ! 🎉', text: 'Merci pour votre achat.' });
  
          const paymentId = res.paymentId;
          if (paymentId) {
            // Mettre à jour le statut
            this.paymentService.updatePaymentStatus(paymentId, 'CONFIRMÉ').subscribe(() => {
              // Vider le panier
              this.basketService.clearBasket(this.basketId).subscribe(() => {
                console.log("✅ Panier vidé avec succès !");
                this.total = 0;
                this.basket = undefined; // Optionnel : mettre à jour l’état
              }, err => {
                console.error("⚠️ Erreur lors du vidage du panier :", err);
              });
            }, err => {
              console.error("⚠️ Erreur lors de la mise à jour du statut :", err);
            });
          }
        }
      }
    });
  }
  
  

}
