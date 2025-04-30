import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
import { User } from '../user/models/user_model';
import { AuthService } from '../user/auth/auth.service';
import { UserService } from '../user/service_user/user.service';
import  { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  notifications: NotificationM[] = [];
  dropdownOpen = false;
  userId!: number;
  imageTimestamp: number = 0;
  connectedUser!: any;
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  user: any = null;
  isLoggedIn = false;
  constructor(
    private notificationService: NotificationService,
    private eRef: ElementRef,
    private userService: UserService,
    private authService: AuthService,
    private basketService: BasketService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBasket();
    this.imageTimestamp = new Date().getTime();
    const tokenData = this.authService.getDecodedToken();
    if (tokenData) {
      const userId = tokenData.userId;
      this.loadUserProfile(userId);
      this.isLoggedIn = true;
    }
  }

  hasRole(role: string): boolean {
    const roles = this.authService.getUserRoles(); 
    return roles.includes(role);
  }
  

  private loadUserProfile(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (data: User) => {
        console.log('User Data:', data);
        this.user = { ...data };
        if (this.user) {
          this.notificationService
            .fetchUnseenNotifications(`${userId}`)
            .subscribe((unseen) => {
              this.notifications = unseen;

              this.notificationService.notifications$.subscribe((newLive) => {
                this.notifications = [...newLive, ...this.notifications]; 
                this.notifications = this.removeDuplicates(this.notifications);
                console.log(this.notifications);
              });
            });

          this.notificationService.connect(`${userId}`);
        }
      },
      error: (err) => {
        console.error('Failed to load user:', err);
      },
    });
  }
  getProfilePictureUrl(): string {
    let url = ''; 
    if (!this.user.profileImageUrl) {
      url = '/assets/images/userDefaultPic.png';
    } else if (this.user.profileImageUrl.startsWith('http')) {
      url = this.user.profileImageUrl;
    } else if (this.user.profileImageUrl.startsWith('/api/user/images/')) {
      url = `http://localhost:8084${this.user.profileImageUrl}`;
    } else {
      url = `http://localhost:8084/api/user/images/${this.user.profileImageUrl}`;
    }
    return `${url}?v=${this.imageTimestamp}`;
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
    return this.notifications.filter((n) => !n.seen).length;
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
      });
    }
  }

  showBasket = false; // Contrôle l'affichage du panier
  basket: Basket | null = null; // Panier actuel
  basketId: number | null = null; // ID du panier saisi par l'utilisateur
  totalPrice: number = 0;
  searchName: string = '';
  searchDate: string = '';

  // Afficher/masquer le panier
  toggleBasket() {
    this.showBasket = !this.showBasket;  // Toggle l'affichage du panier
    console.log('Panier affiché:', this.showBasket);  // Vérifie si l'état du panier change
    if (this.showBasket) {
      console.log('Chargement du panier...');
      this.loadBasket();  // Charge les produits quand le panier s'ouvre
    }
  }
  

  // Ajoutez cette méthode à votre composant
loadUserBasket(): void {
  // 1. Récupérer l'ID de l'utilisateur connecté
  const userId = this.authService.getDecodedToken()?.userId;
  
  if (!userId) {
    alert('Veuillez vous connecter pour voir votre panier');
    return;
  }

  // 2. Charger le panier depuis l'API
  this.basketService.getBasketByUserId(userId).subscribe({
    next: (basket) => {
      if (basket) {
        // 3. Si panier existe, afficher les produits
        this.basket = basket;
        this.loadProductDetails(basket.productIds);
      } else {
        // 4. Si aucun panier, créer un nouveau
        this.createNewBasket(userId);
      }
    },
    error: () => {
      alert('Erreur lors du chargement du panier');
    }
  });
}

// Méthode pour créer un nouveau panier
private createNewBasket(userId: number): void {
  const newBasket: Basket = {
    id_Basket: 0, // Valeur temporaire, sera remplacée par le backend
    dateCreation: new Date().toISOString(),
    statut: 'actif',
    total: 0,
    quantity: 0,
    modePaiement: null,
    dateValidation: null,
    dateModification: null,
    userId: userId,
    productIds: [], // Initialiser avec un tableau vide
    productIdsList: [], // Optionnel mais initialisé
    productDetailsList: [] // Optionnel mais initialisé
  };

  this.basketService.createBasket(newBasket).subscribe({
    next: (createdBasket) => {
      this.basket = createdBasket;
      console.log('Nouveau panier créé', createdBasket);
    },
    error: (error) => {
      console.error('Erreur création panier', error);
    }
  });
}

loadBasketById(): void {
  if (this.basketId !== null) {
    this.basketService
      .getBasketById(this.basketId)
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement du panier', error);
          Swal.fire({
            icon: 'error',
            title: 'Panier non trouvé',
            text: "Le panier avec cet ID n'existe pas.",
          });
          return of(null);
        })
      )
      .subscribe((basket: Basket | null) => {
        if (basket) {
          this.basket = basket;
          this.basket.productIdsList = this.processProductIds(basket.productIds);
          this.loadProductDetails(this.basket.productIdsList);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Aucun panier trouvé',
            text: "Aucun panier trouvé avec cet ID. Veuillez vérifier l'ID du panier.",
          });
        }
      });
  }
}

private processProductIds(productIds: string | number[]): number[] {
  if (typeof productIds === 'string') {
    return productIds.split(',').map((id: string) => parseInt(id.trim(), 10));
  } else if (Array.isArray(productIds)) {
    return productIds as number[];
  }
  return [];
}


  // Charger le panier depuis l'API
  loadBasket(): void {
    this.basketService
      .getAllBaskets()
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement du panier', error);
          return of([]); // Retourner un tableau vide en cas d'erreur
        })
      )
      .subscribe((baskets) => {
        console.log('Baskets récupérés :', baskets);  // Vérifie que les baskets sont bien récupérés
        if (baskets.length > 0) {
          this.basket = baskets[baskets.length - 1]; // Prendre le dernier panier
          console.log('Panier actuel :', this.basket);  // Affiche le panier actuel
        } else {
          console.log('Aucun panier trouvé.');
        }
      });
  }
  
  
  private loadProductDetails(productIds: number[] = []): void {
    // 1. Gestion du cas où productIds est vide/null
    if (!productIds || productIds.length === 0) {
      this.basket!.productDetailsList = [];
      this.updateTotal();
      return;
    }
  
    // 2. Création des requêtes pour chaque produit
    const productRequests = productIds.map(id =>
      this.productService.getProductById(id).pipe(
        catchError(() => of(null)) // Gère les erreurs individuelles
      )
    );
  
    // 3. Exécution parallèle des requêtes
    forkJoin(productRequests).subscribe({
      next: (products) => {
        // 4. Filtrage et transformation des produits
        this.basket!.productDetailsList = products
          .filter(p => p !== null)
          .map(product => {
            // Ajoute l'URL complète de l'image
            product!.imageUrl = `http://localhost:8011/api/products/images/${product!.imageUrl}`;
            
            // Initialise la quantité si nécessaire
            if (product!.quantity === undefined || product!.quantity === null) {
              product!.quantity = 1;
            }
            
            return product as Product;
          });
  
        // 5. Mise à jour du total
        this.updateTotal();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits:', err);
        this.basket!.productDetailsList = [];
        this.updateTotal();
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
      cancelButtonText: 'Non, annuler',
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
        this.basket.productIds = this.basket.productIds.filter(
          (id: number) => id !== productId
        );
      }

      // 2. Mise à jour de productIdsList si elle existe
      if (Array.isArray(this.basket.productIdsList)) {
        this.basket.productIdsList = this.basket.productIdsList.filter(
          (id: number) => id !== productId
        );
      }

      // 3. Mise à jour côté serveur
      this.basketService
        .removeProductFromBasket(this.basket.id_Basket!, productId)
        .pipe(
          catchError((error) => {
            console.error('Erreur lors de la suppression du produit', error);
            this.loadBasket(); // Rechargement du panier en cas d’échec
            return of(null);
          })
        )
        .subscribe({
          next: () => {
            console.log('Produit supprimé avec succès');
            Swal.fire({
              title: 'Succès!',
              text: "L'article a été supprimé du panier.",
              icon: 'success',
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Erreur',
              text: "Impossible de supprimer l'article.",
              icon: 'error',
            });
            console.error('Erreur serveur', err);
          },
        });
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const clickedInsideDropdown = this.dropdownRef?.nativeElement.contains(
      event.target
    );
    const clickedInsideProfile = this.eRef?.nativeElement.contains(
      event.target
    );

    if (!clickedInsideDropdown) {
      this.dropdownOpen = false; // close notification dropdown
    }

    if (!clickedInsideProfile) {
      this.profileDropdownOpen = false; // close profile dropdown
    }
  }

  increaseQuantity(product: Product): void {
    const maxQuantity = product.stock;

    if (product.quantity < maxQuantity) {
      product.quantity++;

      // Appel back-end
      this.productService
        .increaseQuantityBackend(product.id_Product!)
        .subscribe({
          next: () => this.updateTotal(),
          error: () => {
            product.quantity--; // rollback en cas d'erreur
            Swal.fire('Erreur', 'Impossible d’augmenter la quantité', 'error');
          },
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

      this.productService
        .decreaseQuantityBackend(product.id_Product!)
        .subscribe({
          next: () => this.updateTotal(),
          error: () => {
            product.quantity++; // rollback si erreur
            Swal.fire('Erreur', 'Impossible de diminuer la quantité', 'error');
          },
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
        text: "Le panier n'est pas disponible ou non trouvé.",
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
        this.basketService
          .clearBasket(basketId)
          .pipe(
            catchError((error) => {
              console.error('Erreur lors du vidage du panier', error);
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors du vidage du panier.',
              });
              return of(null);
            })
          )
          .subscribe(() => {
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
  profileDropdownOpen = false;

  toggleProfileDropdown(event: Event) {
    event.preventDefault();

    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  logout() {
    Swal.fire({
      title: 'Logout ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.authService.logout();
          this.isLoggedIn = false;
          this.user = null;
          this.notifications = [];
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.error('Error logging out:', error);
        Swal.fire('Error!', 'Error loggin out ', 'error');
      }
    );

    // Maybe navigate to homepage after logout
  }
  activeLink: string = '/';
  setActiveLink(link: string): void {
    this.activeLink = link;
  }
}
