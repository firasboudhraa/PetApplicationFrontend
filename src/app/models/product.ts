export class Product {
  id_Product: number;
  nom: string;
  description: string;
  prix: number;
  imageUrl: string;
  stock: number;
  marketplaceId: number;
  lowStockThreshold: number;
  alertSent: boolean;
  category: string;
  quantity: number;  // Nouvelle propriété pour la quantité

  constructor(
    id_Product: number = 0,
    nom: string = '',
    description: string = '',
    prix: number = 0,
    imageUrl: string = '',
    stock: number = 0,
    marketplaceId: number = 0,
    lowStockThreshold: number = 5,
    alertSent: boolean = false,
    category: string = '', // ajout dans le constructeur
    quantity: number = 1 // valeur par défaut de la quantité
  ) {
    this.id_Product = id_Product;
    this.nom = nom;
    this.description = description;
    this.prix = prix;
    this.imageUrl = imageUrl;
    this.stock = stock;
    this.marketplaceId = marketplaceId;
    this.lowStockThreshold = lowStockThreshold;
    this.alertSent = alertSent;
    this.category = category;
    this.quantity = quantity; // Initialisation de la quantité
  }

  // Méthodes pour gérer la quantité
  increaseQuantity(): void {
    if (this.quantity < this.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
