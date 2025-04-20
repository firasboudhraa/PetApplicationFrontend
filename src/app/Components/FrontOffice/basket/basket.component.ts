import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/app/Services/FrontOffice/basket.service';
import { Basket } from '../../../models/basket';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  baskets: Basket[] = [];
  productIdsInput: string = '';
  editing = false;

  constructor(private basketService: BasketService, private router: Router) {}

  ngOnInit(): void {
    this.loadBaskets();
  }

  

  loadBaskets(): void {
    this.basketService.getAllBaskets().subscribe(data => {
      this.baskets = data;
      this.calculateTotalPrice();
    });
  }

  selectedBasket: Basket = { 
    id_Basket: 0,
    dateCreation: new Date().toISOString(), // ou une chaîne vide ''
    statut: '', 
    total: 0, 
    quantity: 0,
    modePaiement: '', // ou null selon votre interface
    dateValidation: null,
    dateModification: null,
    userId: 0, // ou la valeur par défaut appropriée
    productIds: [] 
  };
  
  submitBasket(): void {
    this.selectedBasket.productIds = this.productIdsInput
      .split(',')
      .map(id => Number(id.trim()));

    if (this.editing && this.selectedBasket.id_Basket) {
      this.basketService.updateBasket(this.selectedBasket.id_Basket, this.selectedBasket).subscribe(() => {
        this.loadBaskets();
        this.resetForm();
      });
    } else {
      this.basketService.createBasket(this.selectedBasket).subscribe(() => {
        this.loadBaskets();
        this.resetForm();
      });
    }
  }

  editBasket(basket: Basket): void {
    this.selectedBasket = { ...basket };
    this.productIdsInput = basket.productIds.join(',');
    this.editing = true;
  }

  deleteBasket(id: number): void {
    this.basketService.deleteBasket(id).subscribe(() => this.loadBaskets());
  }

  clearBasket(id: number): void {
    this.basketService.clearBasket(id).subscribe(() => this.loadBaskets());
  }

  resetForm(): void {
    this.selectedBasket = { 
      id_Basket: 0,
      dateCreation: new Date().toISOString(),
      statut: '', 
      total: 0, 
      quantity: 0,
      modePaiement: '',
      dateValidation: null,
      dateModification: null,
      userId: 0,
      productIds: [] 
    };
    this.productIdsInput = '';
    this.editing = false;
  }
  calculateTotalPrice(): void {
    this.baskets.forEach(basket => {
      basket.total = basket.productIds.reduce((total, productId) => {
        // Suppose you have a method to fetch product prices, you can modify accordingly
        const productPrice = this.getProductPrice(productId); // Replace with actual logic
        return total + (productPrice || 0);
      }, 0);
    });
  }

  getProductPrice(productId: number): number {
    // Replace with logic to fetch the product price
    return 50; // Example fixed price
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  // Ajouter un produit au panier
  addProductToBasket(productId: number): void {
    const basketId = this.selectedBasket.id_Basket;
    console.log('ID du panier sélectionné:', basketId);  // Vérifie si c'est bien un ID valide
  
    if (!basketId) {
      console.error('Aucun panier sélectionné pour ajouter le produit.');
      return;
    }
  
    this.basketService.addProductToBasket(basketId, productId).subscribe({
      next: () => {
        console.log('Produit ajouté !');
        this.loadBaskets();
      },
      error: err => {
        console.error('Erreur lors de l\'ajout au panier', err);
      }
    });
  }
  

  // Supprimer un produit du panier
  deleteProductFromBasket(basketId: number, productId: number): void {
    this.basketService.removeProductFromBasket(basketId, productId).subscribe({
      next: () => {
        console.log('Produit supprimé !');
        this.loadBaskets();
      },
      error: err => console.error(err)
    });
  }
}
