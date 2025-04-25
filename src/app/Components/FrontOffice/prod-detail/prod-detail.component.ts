import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../Services/product-service.service'; 
import { Product } from '../../../models/product';
import { BasketService } from '../../../Services/basket.service'; 
import Swal from 'sweetalert2'; // Pour afficher des messages d'alerte

@Component({
  selector: 'app-prod-detail',
  templateUrl: './prod-detail.component.html',
  styleUrls: ['./prod-detail.component.css']
})
export class ProdDetailComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = true;  
  error: string | null = null;  
  basketId: number | null = null;  // ID du panier sélectionné (peut être null)

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('ID du produit récupéré :', productId);
  
    if (productId) {
      this.productService.getProductById(Number(productId)).subscribe(
        (product) => {
          this.product = product;
          console.log('Produit récupéré:', product);
          this.loading = false;
        },
        (error) => {
          this.error = 'Erreur lors de la récupération du produit. Veuillez réessayer plus tard.';
          console.error('Erreur lors de la récupération du produit', error);
          this.loading = false;
        }
      );
    }
  }

  // Méthode pour mettre à jour le produit
  updateProduct() {
    if (this.product?.id_Product !== undefined) {
      const formData = new FormData();
      formData.append('nom', this.product.nom);
      formData.append('description', this.product.description);
      formData.append('prix', this.product.prix.toString());
      formData.append('stock', this.product.stock.toString());
      formData.append('category', this.product.category);
      formData.append('quantity', this.product.quantity.toString());
    
      // Vérification pour s'assurer que l'élément image existe et n'est pas null
      const imageElement = document.getElementById('image') as HTMLInputElement | null;
      if (imageElement && imageElement.files && imageElement.files[0]) {
        const imageFile = imageElement.files[0];
        formData.append('image', imageFile, imageFile.name);
      } else {
        console.error('Élément image non trouvé ou pas de fichiers sélectionnés');
        Swal.fire('Erreur', 'Aucun fichier d\'image sélectionné.', 'error');
      }
    
      this.loading = true;

      this.productService.updateProduct(this.product.id_Product, formData).subscribe(
        (updatedProduct: Product) => {
          this.product = updatedProduct;  // Mettre à jour le produit après modification
          this.loading = false;
          alert("Produit mis à jour avec succès !");
        },
        (error) => {
          this.error = 'Erreur lors de la mise à jour du produit.';
          this.loading = false;
          console.error(error);
        }
      );
    } else {
      console.error('ID du produit est undefined');
      Swal.fire('Erreur', 'ID du produit est manquant.', 'error');
    }
  }

  // Méthode pour supprimer un produit
  deleteProduct(): void {
    // Vérification plus robuste avec optional chaining et null check
    if (!this.product?.id_Product) {
      console.error('ID du produit est manquant ou invalide');
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'ID du produit est manquant ou invalide',
      });
      return;
    }
  
    // Stockage de l'ID dans une constante pour plus de sécurité
    const productId = this.product.id_Product;
  
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
  
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire({
              title: 'Produit supprimé',
              text: 'Le produit a été supprimé avec succès!',
              icon: 'success'
            });
            // Optionnel: Réinitialiser le produit ou naviguer ailleurs
            this.product = null;
          },
          error: (error) => {
            this.loading = false;
            console.error('Erreur suppression:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression',
            });
          }
        });
      }
    });
  }

  // Méthode pour ajouter le produit au panier
// Méthode pour ajouter le produit au panier - Version corrigée
addToBasket() {
  if (this.basketId === null) {
    Swal.fire({
      icon: 'error',
      title: 'Panier non sélectionné',
      text: 'Veuillez sélectionner un panier avant d\'ajouter un produit.',
      confirmButtonText: 'D\'accord'
    });
    return;
  }

  // Vérification plus stricte des conditions
  if (!this.product?.id_Product) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Produit non sélectionné ou invalide.',
      confirmButtonText: 'D\'accord'
    });
    return;
  }

  // À ce point, TypeScript sait que basketId est number et id_Product existe
  const productId = this.product.id_Product;
  const basketId = this.basketId;

  this.basketService.addProductToBasket(basketId, productId).subscribe(
    () => {
      Swal.fire({
        icon: 'success',
        title: 'Produit ajouté',
        text: 'Produit ajouté au panier avec succès!',
        confirmButtonText: 'D\'accord'
      });
    },
    (error) => {
      console.error('Erreur lors de l\'ajout du produit au panier:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'ajout du produit.',
        confirmButtonText: 'D\'accord'
      });
    }
  );
}
}
