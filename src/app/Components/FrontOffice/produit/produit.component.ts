import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../../Services/FrontOffice/product-service.service';
import { Product } from '../../../models/product'; 
import { BasketService } from '../../../Services/FrontOffice/basket.service'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})

export class ProduitComponent implements OnInit {
  currentProduct: Product = new Product(); // Utilisation du constructeur avec valeurs par défaut
  products: Product[] = [];
  loading: boolean = false;  // Variable pour savoir si l'on est en train de charger des données
  errorMessage: string = '';  // Pour afficher les erreurs

  constructor(private productService: ProductServiceService ,
     private basketService: BasketService) {}

  ngOnInit() {
    this.getProducts(); // Charger les produits à l'initialisation
  }

  // Méthode pour obtenir la liste des produits
  getProducts() {
    this.loading = true;  // Début de chargement
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.loading = false;  // Fin du chargement
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des produits.';
        this.loading = false;  // Fin du chargement même en cas d'erreur
        console.error(error);
      }
    );
  }

  // Méthode pour créer un produit
  createProduct() {
    // Validation des champs obligatoires
    if (!this.currentProduct.nom || this.currentProduct.nom.trim() === '') {
      alert("Le nom du produit est requis.");
      return;
    }
    if (this.currentProduct.prix === undefined || this.currentProduct.prix <= 0) {
      alert("Le prix doit être supérieur à 0.");
      return;
    }
  
    this.loading = true; // Début du chargement
  
    // Appel au service pour créer le produit
    this.productService.createProduct(this.currentProduct).subscribe(
      (product: Product) => {
        console.log('Produit créé avec succès:', product);
        this.products.push(product); // Ajouter le produit créé à la liste
        this.currentProduct = new Product(); // Réinitialiser le formulaire
        this.loading = false; // Fin du chargement
        alert("Produit ajouté avec succès !");
      },
      (error) => {
        console.error('Erreur lors de la création du produit:', error);
        this.errorMessage = 'Erreur lors de la création du produit.';
        this.loading = false; // Fin du chargement même en cas d'erreur
        alert("Une erreur est survenue lors de l'ajout du produit.");
      }
    );
  }

  // Méthode pour mettre à jour un produit
  updateProduct() {
    if (!this.currentProduct.id_Product || this.currentProduct.id_Product === 0) {
      alert("Produit introuvable pour la mise à jour.");
      return;
    }
  
    this.loading = true; // Début du chargement
    this.productService.updateProduct(this.currentProduct.id_Product, this.currentProduct).subscribe(
      (updatedProduct: Product) => {
        const index = this.products.findIndex((p) => p.id_Product === updatedProduct.id_Product);
        if (index !== -1) {
          this.products[index] = updatedProduct; // Mettre à jour la liste locale
        }
        this.currentProduct = new Product(); // Réinitialiser le formulaire
        this.loading = false; // Fin du chargement
        alert("Produit mis à jour avec succès !");
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour du produit.';
        this.loading = false; // Fin du chargement même en cas d'erreur
        console.error(error);
      }
    );
  }
  
  selectProduct(product: Product) {
    // Utiliser une nouvelle instance de la classe Product pour s'assurer que toutes les méthodes sont présentes
    this.currentProduct = Object.assign(new Product(), product);
  }
  

  // Méthode pour supprimer un produit
  deleteProduct(productId: number) {
    this.loading = true;  // Début du chargement
    this.productService.deleteProduct(productId).subscribe(
      () => {
        // Supprimer le produit de la liste localement (sans recharger les données)
        this.products = this.products.filter(p => p.id_Product !== productId);
        this.loading = false;  // Fin du chargement
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la suppression du produit.';
        this.loading = false;  // Fin du chargement même en cas d'erreur
        console.error(error);
      }
    );
  }
  
  // Ajouter un produit au panier
 /* addToCart(product: Product) {
    this.loading = true;  // Début du chargement
  
    // Supposons que basketId soit récupéré depuis un service ou un store
    const basketId = this.getBasketId(); // Récupérer l'ID du panier en cours
    
    this.basketService.addProductToBasket(basketId, product.id_Product).subscribe(
      (response) => {
        console.log('Produit ajouté au panier', response);
        this.loading = false;
        alert('Produit ajouté au panier !');
      },
      (error) => {
        console.error('Erreur lors de l\'ajout au panier', error);
        this.errorMessage = 'Erreur lors de l\'ajout du produit au panier.';
        this.loading = false;
        alert('Une erreur est survenue lors de l\'ajout du produit.');
      }
    );
  }*/

  getBasketId(): number {
  // Supposons que l'ID du panier est stocké dans le localStorage ou un service
  const basketId = localStorage.getItem('basketId');
  if (basketId) {
    return parseInt(basketId, 10);
  } else {
    alert('Aucun panier actif trouvé.');
    throw new Error('Aucun panier actif trouvé.');
  }
}

}
