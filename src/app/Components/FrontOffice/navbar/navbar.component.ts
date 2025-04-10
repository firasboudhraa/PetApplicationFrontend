import { Component, OnInit } from '@angular/core';
import { BasketService, Basket } from '../../../Services/FrontOffice/basket.service'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showBasket = false;  // Contrôle l'affichage du panier
  basket: Basket | null = null; // Panier actuel

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.loadBasket(); // Charger le panier au démarrage
  }

  // Afficher/masquer le panier
  toggleBasket() {
    this.showBasket = !this.showBasket;
  }

  // Charger le panier depuis l'API
  loadBasket(): void {
    this.basketService.getAllBaskets().pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement du panier', error);
        return of([]); // Retourner un tableau vide en cas d'erreur
      })
    ).subscribe((baskets) => {
      console.log('Baskets récupérés :', baskets);  // Ajoutez cette ligne pour afficher les baskets récupérés
      if (baskets.length > 0) {
        this.basket = baskets[baskets.length - 1]; // Prendre le dernier panier
        console.log('Panier actuel :', this.basket);  // Afficher le panier actuel
      }
    });
  }
  

  // Demander confirmation avant de supprimer un article
  confirmRemoveItem(productId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.removeItem(productId);
    }
  }

  // Retirer un produit du panier
  removeItem(productId: number) {
    if (this.basket) {
      // Suppression de l'ID du produit du panier localement
      this.basket.productIds = this.basket.productIds.filter(id => id !== productId);
      
      // Mettre à jour le panier côté serveur
      this.basketService.removeProductFromBasket(this.basket.id_Basket!, productId).pipe(
        catchError((error) => {
          console.error('Erreur lors de la suppression du produit', error);
          return of(); // En cas d'erreur, ne rien faire
        })
      ).subscribe(() => {
        this.loadBasket(); // Recharger les informations du panier après modification
      });
    }
  }

  // Vider le panier
  clearBasket() {
    if (this.basket && confirm('Êtes-vous sûr de vouloir vider tout le panier ?')) {
      this.basketService.clearBasket(this.basket.id_Basket!).pipe(
        catchError((error) => {
          console.error('Erreur lors du vidage du panier', error);
          return of(); // En cas d'erreur, ne rien faire
        })
      ).subscribe(() => {
        this.basket!.productIds = []; // Réinitialiser les articles du panier localement
      });
    }
  }
}
