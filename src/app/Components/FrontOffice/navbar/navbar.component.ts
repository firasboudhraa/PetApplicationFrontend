import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';
import { NotificationM } from 'src/app/models/notification';
import { BasketService } from '../../../Services/basket.service'; 
import { ProductService } from 'src/app/Services/product-service.service'; 
import { Basket } from '../../../models/basket'; 
import { Product } from '../../../models/product';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  notifications: NotificationM[] = [];
  dropdownOpen = false;
  userId :number = 1; 

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor(private notificationService: NotificationService,private basketService: BasketService , private productService: ProductService) {}

  ngOnInit(): void {
    this.loadBasket(); // Charger le panier au démarrage

    // First, fetch unseen notifications
    this.notificationService.fetchUnseenNotifications(`${this.userId}`).subscribe((unseen) => {
      this.notifications = unseen;
  
      // Then subscribe to live notifications
      this.notificationService.notifications$.subscribe((newLive) => {
        this.notifications = [...newLive, ...this.notifications]; // merge
        this.notifications = this.removeDuplicates(this.notifications);
      });
    });
  
    this.notificationService.connect(`${this.userId}`);
  }
  removeDuplicates(notifs: NotificationM[]): NotificationM[] {
    const seen = new Set();
    return notifs.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }

  get unseenCount(): number {
    return this.notifications.filter(n => !n.seen).length;
  }
  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  markAsRead(notification: NotificationM): void {
    if (!notification.seen) {
      this.notificationService.markAsSeen(notification.id).subscribe(() => {
        notification.seen = true; // Mark as seen in the UI
      })};}

  showBasket = false;  // Contrôle l'affichage du panier
  basket: Basket | null = null; // Panier actuel
  basketId: number | null = null; // ID du panier saisi par l'utilisateur
  totalPrice: number = 0;
  searchName: string = '';
  searchDate: string = '';






  // Afficher/masquer le panier
  toggleBasket() {
    this.showBasket = !this.showBasket;
  }

  loadBasketById(): void {
    if (this.basketId !== null) {
      this.basketService.getBasketById(this.basketId).pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement du panier', error);
          Swal.fire({
            icon: 'error',
            title: 'Panier non trouvé',
            text: 'Le panier avec cet ID n\'existe pas.',
          });
          return of(null);
        })
      ).subscribe((basket: Basket | null) => {
        if (basket) {
          this.basket = basket;
  
          // Vérification et conversion de 'productIds'
          if (basket.productIds) {
            if (typeof basket.productIds === 'string') {
              const idsString = basket.productIds as string;
              this.basket.productIdsList = idsString.split(',')
                .map((id: string) => parseInt(id.trim(), 10))
                .filter(id => !isNaN(id));
            } else if (Array.isArray(basket.productIds)) {
              this.basket.productIdsList = basket.productIds;
            }
          } else {
            console.error('productIds est undefined ou null');
            this.basket.productIdsList = [];
          }
  
          // Charger les détails des produits
          if (this.basket.productIdsList && this.basket.productIdsList.length > 0) {
            const productDetailObservables = this.basket.productIdsList.map(id =>
              this.productService.getProductById(id).pipe(catchError(() => of(null)))
            );
  
            forkJoin(productDetailObservables).subscribe(products => {
              const filteredProducts = products.filter(p => p !== null) as Product[];
  
              // Ajouter l'URL complète de l'image et initialiser la quantité à 1
              filteredProducts.forEach(product => {
                product.imageUrl = `http://localhost:8011/api/products/images/${product.imageUrl}`;
                if (product.quantity === undefined || product.quantity === null) {
                  product.quantity = 1;  // Initialiser la quantité à 1 lors de l'ajout du produit
                }
              });
  
              this.basket!.productDetailsList = filteredProducts;
  
              // Calcul du total en fonction du prix * quantité
              this.totalPrice = filteredProducts.reduce(
                (sum, product) => sum + (product.prix || 0) * (product.quantity || 1),
                0
              );
            });
          } else {
            this.basket.productDetailsList = [];
            this.totalPrice = 0; // Panier vide = prix total à 0
          }
  
          console.log('Panier récupéré :', this.basket);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Aucun panier trouvé',
            text: 'Aucun panier trouvé avec cet ID. Veuillez vérifier l\'ID du panier.',
          });
        }
      });
    }
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
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous êtes sur le point de supprimer cet article du panier.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeItem(productId);
      }
    });
  }

  removeItem(productId: number) {
    if (this.basket) {
      // 1. Suppression locale dans productIds (déjà un tableau de number)
      if (Array.isArray(this.basket.productIds)) {
        this.basket.productIds = this.basket.productIds.filter((id: number) => id !== productId);
      }

      // 2. Mise à jour de productIdsList si elle existe
      if (Array.isArray(this.basket.productIdsList)) {
        this.basket.productIdsList = this.basket.productIdsList.filter((id: number) => id !== productId);
      }

      // 3. Mise à jour côté serveur
      this.basketService.removeProductFromBasket(this.basket.id_Basket!, productId).pipe(
        catchError((error) => {
          console.error('Erreur lors de la suppression du produit', error);
          this.loadBasket(); // Rechargement du panier en cas d’échec
          return of(null);
        })
      ).subscribe({
        next: () => {
          console.log('Produit supprimé avec succès');
          Swal.fire({
            title: 'Succès!',
            text: 'L\'article a été supprimé du panier.',
            icon: 'success',
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Impossible de supprimer l\'article.',
            icon: 'error',
          });
          console.error('Erreur serveur', err);
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.dropdownRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
  increaseQuantity(product: Product): void {
    const maxQuantity = product.stock;
  
    if (product.quantity < maxQuantity) {
      product.quantity++;
  
      // Appel back-end
      this.productService.increaseQuantityBackend(product.id_Product!).subscribe({
        next: () => this.updateTotal(),
        error: () => {
          product.quantity--; // rollback en cas d'erreur
          Swal.fire('Erreur', 'Impossible d’augmenter la quantité', 'error');
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Quantité maximale atteinte',
        text: `Désolé, la quantité maximale pour ce produit est ${maxQuantity}.`,
      });
    }
  }
  
  
  decreaseQuantity(product: Product): void {
    if (product.quantity > 1) {
      product.quantity--;
  
      this.productService.decreaseQuantityBackend(product.id_Product!).subscribe({
        next: () => this.updateTotal(),
        error: () => {
          product.quantity++; // rollback si erreur
          Swal.fire('Erreur', 'Impossible de diminuer la quantité', 'error');
        }
      });
    }
  }
  
  
  updateTotal(): void {
    // Vérifier si this.basket et productDetailsList sont définis
    if (this.basket && this.basket.productDetailsList) {
      this.totalPrice = this.basket.productDetailsList.reduce(
        (sum, product) => sum + (product.prix || 0) * (product.quantity || 1),
        0
      );
    } else {
      this.totalPrice = 0; // Dans le cas où la liste des produits est vide ou le panier est undefined
    }
  }
  
  
  
  

  clearBasket() {
    if (!this.basket || this.basket.id_Basket == null) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le panier n\'est pas disponible ou non trouvé.',
      });
      return;
    }
  
    const basketId = this.basket.id_Basket; // Stocker l'ID dans une variable pour plus de sécurité
  
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous êtes sur le point de vider tout le panier. Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, vider le panier',
      cancelButtonText: 'Non, annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.basketService.clearBasket(basketId).pipe(
          catchError((error) => {
            console.error('Erreur lors du vidage du panier', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors du vidage du panier.',
            });
            return of(null);
          })
        ).subscribe(() => {
          // Mise à jour locale du panier
          if (this.basket) {
            this.basket.productIds = [];
            if (this.basket.productIdsList) {
              this.basket.productIdsList = [];
            }
          }
  
          Swal.fire({
            title: 'Succès!',
            text: 'Le panier a été vidé.',
            icon: 'success',
          });
        });
      }
    });
  }
  
}
