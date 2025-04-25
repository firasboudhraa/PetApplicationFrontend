import { Component } from '@angular/core';
import { Product } from 'src/app/models/product';
import Swal from 'sweetalert2';
import { Basket } from 'src/app/models/basket';
import { BasketService } from 'src/app/Services/basket.service';

@Component({
  selector: 'app-basket-back',
  templateUrl: './basket-back.component.html',
  styleUrls: ['./basket-back.component.css']
})
export class BasketBackComponent {
  baskets: (Basket & { products: Product[] })[] = [];
  basketCount: number = 0;
  allBaskets: Basket[] = [];
  basketId: number = 0;
  products: Product[] = [];
  userId: number = 1; 
  loading: boolean = false;
  selectedBasket: Basket | null = null; 

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.loadBaskets();
    this.loadAllBaskets(); 
  }

  loadAllBaskets(): void {
    this.basketService.getAllBaskets().subscribe(
      (allBaskets) => {
        this.allBaskets = allBaskets;
      },
      (error) => {
        console.error('Erreur lors de la récupération de tous les paniers:', error);
      }
    );
  }

  // Appelée quand l'utilisateur change
  onUserIdChange(): void {
    this.loadBaskets();
  }

  onBasketIdChange(): void {
    if (this.basketId) {
      this.basketService.getProductsByBasketId(this.basketId).subscribe(
        (data) => {
          this.products = data; // Assigner les produits récupérés
        },
        (error) => {
          console.error('Erreur lors de la récupération des produits', error);
        }
      );
    }
  }

 // Mettre à jour un panier
 updateBasket(basketId: number): void {
  // Vérifier si l'ID du panier est défini avant de continuer
  if (!basketId) {
    Swal.fire('Erreur', 'ID de panier invalide.', 'error');
    return;
  }

  // Appeler le service pour récupérer le panier par ID
  this.basketService.getBasketById(basketId).subscribe({
    next: (basket) => {
      if (!basket) {
        Swal.fire('Erreur', 'Le panier sélectionné n\'existe pas.', 'error');
        return;
      }

      // Créer un objet Basket à partir des données du panier récupéré
      const updatedBasket: Basket = {
        id_Basket: basket.id_Basket,  // Garder l'id_Basket
        userId: basket.userId,  // Assurez-vous d'inclure l'userId (si nécessaire)
        total: basket.total,  // Garder le total
        statut: basket.statut || 'validé',  // Utilise "validé" si "statut" est vide
        quantity: basket.quantity || 1,  // Utilise 0 si "quantity" est vide
        dateCreation: basket.dateCreation,  // Garder la date de création
        modePaiement: basket.modePaiement || 'carte',  // Utilise "carte" par défaut
        dateValidation: basket.dateValidation,  // Garder la date de validation
        dateModification: new Date().toISOString(),
        productIdsList: basket.productIdsList || [],  // Liste des produits (tableau)
        productIds: basket.productIds || ''  // Assure-toi que productIds est une chaîne vide si non défini
      };

      // Appeler le service pour mettre à jour le panier
      this.basketService.updateBasket(basketId, updatedBasket).subscribe({
        next: () => {
          // Si la mise à jour réussit, recharger la liste des paniers et afficher un message de succès
          this.loadAllBaskets();
          Swal.fire('Panier mis à jour', 'Le panier a été mis à jour avec succès.', 'success');
          this.selectedBasket = null;  // Réinitialiser le panier sélectionné après la mise à jour
        },
        error: (err) => {
          // Si la mise à jour échoue, afficher un message d'erreur
          Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du panier.', 'error');
          console.error('Erreur de mise à jour du panier', err);  // Log de l'erreur pour débogage
        }
      });
    },
    error: (err) => {
      // Si la récupération du panier échoue, afficher un message d'erreur
      Swal.fire('Erreur', 'Impossible de récupérer le panier.', 'error');
      console.error('Erreur lors de la récupération du panier', err);  // Log de l'erreur pour débogage
    }
  });
}

selectBasketForUpdate(basket: Basket): void {
  this.selectedBasket = { ...basket };  // Créer une copie du panier sélectionné pour le modifier
}
submitUpdate(): void {
  if (this.selectedBasket && this.selectedBasket.id_Basket) {
    // Ajoute la date de modification
    this.selectedBasket.dateModification = new Date().toISOString();

    // Appel au service pour mettre à jour le panier
    this.basketService.updateBasket(this.selectedBasket.id_Basket, this.selectedBasket).subscribe({
      next: (updatedBasket) => {
        Swal.fire('Succès', 'Panier mis à jour avec succès', 'success');
        this.ngOnInit(); // Recharge la liste des paniers après mise à jour
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Erreur', 'Erreur lors de la mise à jour du panier', 'error');
      }
    });
  } else {
    Swal.fire('Erreur', 'Aucun panier sélectionné pour la mise à jour', 'error');
  }
}



// Supprimer un panier
deleteBasket(basketId: number): void {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Cette action est irréversible!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.basketService.deleteBasket(basketId).subscribe(() => {
        this.loadAllBaskets();
        Swal.fire('Panier supprimé', 'Le panier a été supprimé avec succès.', 'success');
      });
    }
  });
}
  
loadBaskets(): void {
  this.loading = true;

  // Remplacez getBasketsByUserId par getAllBasketsByUser
  this.basketService.getAllBasketsByUser(this.userId).subscribe(baskets => {
    this.baskets = []; // Réinitialise les paniers avant de les charger

    // Pour chaque panier, on va récupérer ses produits
    baskets.forEach(basket => {
      const basketWithProducts: Basket & { products: Product[] } = { ...basket, products: [] };

      // Récupérer les produits associés au panier via la méthode getProductsByBasketId
      this.basketService.getProductsByBasketId(basket.id_Basket).subscribe(products => {
        basketWithProducts.products = products;
        this.baskets.push(basketWithProducts);
      }, error => {
        console.error(`Erreur lors de la récupération des produits pour le panier ${basket.id_Basket}`, error);
        this.baskets.push(basketWithProducts); // Ajout du panier même sans produits
      });
    });

    this.loading = false;
  }, error => {
    console.error('Erreur lors de la récupération des paniers:', error);
    this.loading = false;
  });
}

  createNewBasket(): void {
    const currentDate = new Date().toISOString().slice(0, 16); // Format ISO pour input datetime-local
  
    Swal.fire({
      title: 'Créer un nouveau panier',
      html: `
        <label>Date de création</label>
        <input type="datetime-local" class="swal2-input" value="${currentDate}" disabled>
  <br>
        <br>

        <label>Mode de paiement</label>
        <br>
        <br>
        <select id="modePaiement" class="swal2-input">
          <option value="carte">Carte</option>
          <option value="stripe">Stripe</option>
          <option value="cash">Cash</option>
        </select>
      
  <br>
   <br>
        <label>ID utilisateur</label>
        <input type="number" id="userIdInput" class="swal2-input" placeholder="Entrez l'ID de l\'utilisateur" value="${this.userId || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Créer',
      preConfirm: () => {
        const modePaiement = (document.getElementById('modePaiement') as HTMLSelectElement).value;
        const userId = parseInt((document.getElementById('userIdInput') as HTMLInputElement).value, 10);
  
        if (isNaN(userId) || userId <= 0) {
          Swal.showValidationMessage('Veuillez entrer un ID utilisateur valide.');
          return;
        }
  
        // Correspond exactement à la structure JSON utilisée dans le test Postman
        const newBasket = {
          userId: userId,
          modePaiement: modePaiement,
          productIdsList: []
        };
  
        return newBasket;
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const basketData = result.value;
  
        this.basketService.createBasket(basketData).subscribe(() => {
          Swal.fire('Succès', 'Panier créé avec succès !', 'success');
          this.loadBaskets();
        }, error => {
          Swal.fire('Erreur', 'Erreur lors de la création du panier', 'error');
          console.error(error);
        });
      }
    });
  }
}
