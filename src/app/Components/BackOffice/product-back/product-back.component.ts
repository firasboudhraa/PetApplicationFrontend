import { Component } from '@angular/core';
import { Product } from 'src/app/models/product';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { ProductService } from 'src/app/Services/product-service.service';


@Component({
  selector: 'app-product-back',
  templateUrl: './product-back.component.html',
  styleUrls: ['./product-back.component.css']
})
export class ProductBackComponent {
  showUpdateProductForm: boolean = false;
  selectedProduct: any = null;
    productToEdit: Product | null = null;
    editMode: boolean = false;
  
    products: Product[] = [];
    filteredProducts: Product[] = [];
    pagedProducts: Product[] = [];
  
    totalProducts = 0;
    inStock = 0;
    outOfStock = 0;
    lowStock = 0;
  
    currentPage: number = 0;
    itemsPerPage: number = 3;
    totalPages: number = 1;
  
    errorMessage = '';
    isLoading = true;
  
    selectedMarketplaceId = 1;
    searchTerm = '';
    isDescending = true;
    showAddProductForm = false;
  
    selectedFile: File | null = null;
    previewImage: string | ArrayBuffer | null = null;
  
    newProduct: Product = {
      nom: '',
      description: '',
      prix: 0,
      stock: 0,
      imageUrl: '',
      marketplaceId: this.selectedMarketplaceId,
      lowStockThreshold: 0,
      alertSent: false,
      category: '',
      quantity: 0
    };
  
    constructor(private productService: ProductService, private http: HttpClient) {}
  
    ngOnInit(): void {
      this.loadProductsByMarketplace(this.selectedMarketplaceId);
    }
  
    toggleProductForm(): void {
      this.showAddProductForm = !this.showAddProductForm;
    }
  
    loadProductsByMarketplace(marketplaceId: number): void {
      this.isLoading = true;
      this.errorMessage = '';
      this.productService.getProductsByMarketplaceId(marketplaceId).subscribe({
        next: (data: Product[]) => {
          this.products = data;
  
          // Ajout de l'URL de l'image pour chaque produit
          this.products.forEach(product => {
            product.imageUrl = `http://localhost:8011/api/products/images/${product.imageUrl}`;
          });
  
          this.filterProducts();
          this.calculateStats();
          this.calculateTotalPages();
          this.updatePagedProducts();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Erreur lors du chargement des produits';
          this.isLoading = false;
        }
      });
    }
  
  
    
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImage = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
    
    addProduct(): void {
      if (!this.selectedFile) {
        alert("Veuillez sélectionner une image.");
        return;
      }
    
      const formData = new FormData();
      formData.append("nom", this.newProduct.nom);
      formData.append("description", this.newProduct.description);
      formData.append("prix", this.newProduct.prix.toString());
      formData.append("stock", this.newProduct.stock.toString());
      formData.append("category", this.newProduct.category);
      formData.append('quantity', this.newProduct.quantity.toString());
      formData.append("image", this.selectedFile, this.selectedFile.name);
    
      this.productService.createProduct(formData).subscribe({
        next: (product: Product) => {
          this.products.push(product);
          this.filterProducts();
          this.calculateStats();
          this.calculateTotalPages();
          this.updatePagedProducts();
          this.toggleProductForm();
          this.resetNewProduct();
          this.previewImage = null;
          this.selectedFile = null;
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage = "Erreur lors de l'ajout du produit.";
        }
      });
    }
    
  
    resetNewProduct(): void {
      this.newProduct = {
        nom: '',
        description: '',
        prix: 0,
        stock: 0,
        imageUrl: '',
        category: '',
        lowStockThreshold: 0,
        marketplaceId: this.selectedMarketplaceId,
        alertSent: false,
        quantity: 0
      };
    }
  
    changePage(direction: number): void {
      const newPage = this.currentPage + direction;
      if (newPage >= 0 && newPage < this.totalPages) {
        this.currentPage = newPage;
        this.updatePagedProducts();
      }
    }
  
    updatePagedProducts(): void {
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedProducts = this.filteredProducts.slice(startIndex, endIndex);
    }
  
    filterProducts(): void {
      this.filteredProducts = this.products.filter(product =>
        product.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.calculateStats();
      this.calculateTotalPages();
      this.updatePagedProducts();
    }
  
    calculateStats(): void {
      this.totalProducts = this.filteredProducts.length;
      this.inStock = this.filteredProducts.filter(p => p.stock > 0).length;
      this.outOfStock = this.filteredProducts.filter(p => p.stock === 0).length;
      this.lowStock = this.filteredProducts.filter(p =>
        p.stock > 0 && p.stock <= p.lowStockThreshold
      ).length;
    }
  
    calculateTotalPages(): void {
      this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }
  
    onSearchTermChange(): void {
      this.filterProducts();
    }
  
    sortByStock(): void {
      this.filteredProducts.sort((a, b) =>
        this.isDescending ? b.stock - a.stock : a.stock - b.stock
      );
      this.isDescending = !this.isDescending;
      this.updatePagedProducts();
    }
  
    onEditFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        // Logique de traitement du fichier
        console.log('Fichier sélectionné pour modification:', input.files[0]);
      }
    }
  
    editProduct(product: Product): void {
      this.selectedProduct = { ...product }; // Utilisation de spread operator pour créer une copie du produit
      this.showUpdateProductForm = true; // Afficher le formulaire de mise à jour
      this.previewImage = null; // Réinitialise l'image de prévisualisation (si vous en avez une)
    }
  
  
    updateProduct(): void {
      // Vérifier si selectedProduct est défini
      if (!this.selectedProduct) {
        console.error('Produit non sélectionné.');
        return;
      }
    
      const formData = new FormData();
    
      // Ajouter les propriétés de selectedProduct à formData
      formData.append('nom', this.selectedProduct.nom);
      formData.append('description', this.selectedProduct.description);
      formData.append('prix', Number(this.selectedProduct.prix).toString()); 
      formData.append('category', this.selectedProduct.category);
      formData.append('stock', this.selectedProduct.stock.toString());
      formData.append('quantity', this.selectedProduct.lowStockThreshold.toString());
    
      // Ajouter l'image si elle est sélectionnée
      if (this.selectedFile instanceof File) {
        formData.append('image', this.selectedFile);
      }
    
      // Appeler le service pour mettre à jour le produit
      this.productService.updateProduct(this.selectedProduct.id_Product!, formData).subscribe(
        () => {
          // SweetAlert2 popup de succès
          Swal.fire({
            icon: 'success',
            title: 'Produit mis à jour avec succès !',
            showConfirmButton: false,
            timer: 1500 // Popup qui disparaît après 1,5 seconde
          }).then(() => {
            // Optionnel : Réinitialiser l'état ou effectuer des actions supplémentaires
          });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit:', error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour.', 'error');
        }
      );
    }
          
    
    cancelEdit(): void {
      // Réinitialisation des variables d'édition
      this.productToEdit = null;
      this.editMode = false;
      this.previewImage = null;
      this.selectedFile = null;
    
      // Masquer le formulaire de mise à jour
      this.showUpdateProductForm = false;
    }
    
    
  
    // Méthode pour télécharger l'image
    uploadImage(formData: FormData) {
      return this.http.post<{ imageUrl: string }>('http://localhost:8011/api/products/upload', formData); 
    }
  
    // Supprimer un produit
    deleteProduct(product: Product): void {
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: `Vous allez supprimer le produit ${product.nom}. Cette action est irréversible.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          this.productService.deleteProduct(product.id_Product!).subscribe({
            next: () => {
              this.loadProductsByMarketplace(this.selectedMarketplaceId);
              Swal.fire('Supprimé!', 'Le produit a été supprimé avec succès.', 'success');
            },
            error: (error) => {
              console.error(error);
              Swal.fire('Erreur', 'Il y a eu un problème lors de la suppression.', 'error');
            }
          });
        }
      });
    }
}
