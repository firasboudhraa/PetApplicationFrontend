import { Component, OnInit } from '@angular/core';
import { Basket, BasketService } from 'src/app/Services/FrontOffice/basket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})


export class BasketComponent implements OnInit {
  baskets: Basket[] = [];
  selectedBasket: Basket = { statut: '', total: 0, modePaiement: '', productIds: [] };
  productIdsInput: string = ''; // <-- Nouveau champ pour la saisie de l'utilisateur
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

  submitBasket(): void {
    // Conversion de la chaîne en tableau de nombres
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
    this.productIdsInput = basket.productIds.join(','); // <-- conversion inverse pour l'affichage
    this.editing = true;
  }

  deleteBasket(id: number): void {
    this.basketService.deleteBasket(id).subscribe(() => this.loadBaskets());
  }

  clearBasket(id: number): void {
    this.basketService.clearBasket(id).subscribe(() => this.loadBaskets());
  }

  resetForm(): void {
    this.selectedBasket = { statut: '', total: 0, modePaiement: '', productIds: [] };
    this.productIdsInput = ''; // <-- reset du champ temporaire
    this.editing = false;
  }

  calculateTotalPrice(): number {
    return this.baskets.reduce((total, basket) => total + basket.total, 0);
  }

  goToProducts(): void {
    // Redirection vers la liste des produits
    this.router.navigate(['/products']);
  }
  
}
