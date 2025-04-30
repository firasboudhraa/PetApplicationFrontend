import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Services/product-service.service';
import { Product } from '../../../models/product';
import { Basket } from '../../../models/basket';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BasketService } from '../../../Services/basket.service';
import { environment } from 'src/environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UserService} from 'src/app/Services/user.service'


@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})

export class ProduitComponent implements OnInit {

  currentProduct: Product = {
    nom: '',
    description: '',
    prix: 0,
    imageUrl: '',
    stock: 0,
    marketplaceId: 0,
    lowStockThreshold: 0,
    alertSent: false,
    category: '',
    quantity: 0,
    userId: 0
  }; // Initialisation avec les valeurs par défaut de l'interface
  products: Product[] = [];
  selectedBasketId: number = 0;
  baskets: Basket[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  basketIds: { [key: number]: number } = {};
  filteredProducts: Product[] = [];
  searchQueryName: string = '';  // Recherche par nom
  selectedCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  // Ajoutez ces propriétés à votre classe
  priceRange = {
    min: 0,
    max: 5000  // Ajustez selon vos prix maximum
  };
  selectedPriceRange = {
    min: 0,
    max: 5000
  };
  categories: string[] = [
    'Alimentation',
    'Accessoires',
    'Hygiène et soins',
    'Santé',
    'Habitat'
  ];


  constructor(private productService: ProductService,
    private basketService: BasketService,
    private authService: UserService,
    private http: HttpClient) { }

  ngOnInit() {
    this.getProducts();
    this.getBaskets();
    this.filterProducts();
  }

  initializeBasket() {
    let basketId = localStorage.getItem('basketId');

    if (!basketId) {
      // Créer un nouveau panier avec un ID unique
      basketId = Math.floor(Math.random() * 1000000).toString();
      localStorage.setItem('basketId', basketId);
      console.log('Nouveau panier créé avec ID:', basketId);
    }
  }
  // Méthode pour obtenir la liste des produits
  getProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.filteredProducts = [...data]; // Crée une copie pour les produits filtrés
        this.loading = false;
        this.filterProducts(); // Applique les filtres initiaux
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des produits.';
        this.loading = false;
        console.error(error);
      }
    );
  }

  filterProducts(): void {
    // Si les produits ne sont pas encore chargés, ne rien faire
    if (!this.products) return;

    let filtered = [...this.products];

    // Filtrage par nom (si recherche active)
    if (this.searchQueryName && this.searchQueryName.trim() !== '') {
      const searchTerm = this.searchQueryName.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Filtrage par catégorie (si une catégorie est sélectionnée)
    if (this.selectedCategory && this.selectedCategory !== '') {
      filtered = filtered.filter(product =>
        product.category === this.selectedCategory
      );
    }

    // Filtrage par prix
    filtered = filtered.filter(product =>
      product.prix >= this.selectedPriceRange.min &&
      product.prix <= this.selectedPriceRange.max
    );


    this.filteredProducts = filtered;
  }


  getBaskets() {
    this.basketService.getAllBaskets().subscribe(
      (data: any[]) => {
        // Convertir les objets du service au format attendu par le composant
        this.baskets = data.map((basket: any) => ({
          id_Basket: basket.id_Basket,
          dateCreation: basket.dateCreation,
          statut: basket.statut,
          total: basket.total,
          quantity: basket.quantity || 0,  // Ajoutez des valeurs par défaut si nécessaire
          modePaiement: basket.modePaiement,
          dateValidation: basket.dateValidation,
          dateModification: basket.dateModification,
          userId: basket.userId || 0,
          productIds: basket.productIds,
          productIdsList: basket.productIdsList || []  // Ajoutez une valeur par défaut si nécessaire
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des paniers:', error);
      }
    );
  }

  setBasketIdForProduct(productId: number, basketId: number) {
    this.basketIds[productId] = basketId;
  }

  addToBasket(productId: number) {
    const userId = this.authService.getCurrentUserId();
  
    console.log('ID de l’utilisateur connecté:', userId);
  
    // Étape 1 : récupérer le ou les paniers de l'utilisateur
    this.basketService.getAllBasketsByUser(userId).subscribe(
      (baskets) => {
        if (!baskets || baskets.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Aucun panier trouvé',
            text: 'Aucun panier n\'a été trouvé pour cet utilisateur.',
            confirmButtonText: 'D\'accord'
          });
          return;
        }
  
        // Exemple : on prend le premier panier trouvé (ou celui qui est "actif")
        const basket = baskets[0];
        const basketId = basket.id_Basket;
  
        console.log('ID du panier:', basketId);
        console.log('ID du produit:', productId);
  
        // Étape 2 : ajouter le produit au panier via POST
        this.basketService.addProductToBasketbyUser(userId, basketId, productId).subscribe(
          (response) => {
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
      },
      (error) => {
        console.error('Erreur lors de la récupération du panier:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer les paniers de l’utilisateur.',
          confirmButtonText: 'D\'accord'
        });
      }
    );
  }
  
  





  // Méthode pour créer un produit
  createProduct() {
    if (!this.currentProduct.nom || this.currentProduct.nom.trim() === '') {
      alert("Le nom du produit est requis.");
      return;
    }
    if (this.currentProduct.prix <= 0) {
      alert("Le prix doit être supérieur à 0.");
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.currentProduct.nom);
    formData.append('description', this.currentProduct.description);
    formData.append('prix', this.currentProduct.prix.toString());
    formData.append('stock', this.currentProduct.stock.toString());
    formData.append('category', this.currentProduct.category);
    formData.append('quantity', this.currentProduct.quantity.toString());

    // If there's an image, append it to the form data
    const imageFile = (document.getElementById('image') as HTMLInputElement).files?.[0];
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    this.loading = true;

    this.productService.createProduct(formData).subscribe(
      (product: Product) => {
        console.log('Produit créé avec succès:', product);
        this.products.push(product);
        this.currentProduct = {
          nom: '',
          description: '',
          prix: 0,
          imageUrl: '',
          stock: 0,
          marketplaceId: 0,
          lowStockThreshold: 0,
          alertSent: false,
          category: '',
          quantity: 0,
          userId: 0
        }; // Réinitialiser
        this.loading = false;
        alert("Produit ajouté avec succès !");
      },
      (error) => {
        console.error('Erreur lors de la création du produit:', error);
        this.errorMessage = 'Erreur lors de la création du produit.';
        this.loading = false;
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

    const formData = new FormData();
    formData.append('nom', this.currentProduct.nom);
    formData.append('description', this.currentProduct.description);
    formData.append('prix', this.currentProduct.prix.toString());
    formData.append('stock', this.currentProduct.stock.toString());
    formData.append('category', this.currentProduct.category);
    formData.append('quantity', this.currentProduct.quantity.toString());

    // If there's an image, append it to the form data
    const imageFile = (document.getElementById('image') as HTMLInputElement).files?.[0];
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    this.loading = true;

    this.productService.updateProduct(this.currentProduct.id_Product, formData).subscribe(
      (updatedProduct: Product) => {
        const index = this.products.findIndex((p) => p.id_Product === updatedProduct.id_Product);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.currentProduct = {
          nom: '',
          description: '',
          prix: 0,
          imageUrl: '',
          stock: 0,
          marketplaceId: 0,
          lowStockThreshold: 0,
          alertSent: false,
          category: '',
          quantity: 0,
          userId: 0
        }; // Réinitialiser
        this.loading = false;
        alert("Produit mis à jour avec succès !");
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour du produit.';
        this.loading = false;
        console.error(error);
      }
    );
  }

  selectProduct(product: Product) {
    this.currentProduct = { ...product }; // Copie du produit pour l'édition
  }

  deleteProduct(productId: number) {
    // Afficher la confirmation de suppression
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

        // Appel au service pour supprimer le produit
        this.productService.deleteProduct(productId).subscribe(
          () => {
            this.products = this.products.filter(p => p.id_Product !== productId);
            this.loading = false;

            // Message de succès après suppression
            Swal.fire({
              icon: 'success',
              title: 'Produit supprimé',
              text: 'Le produit a été supprimé avec succès!',
              confirmButtonText: 'D\'accord'
            });
          },
          (error) => {
            this.errorMessage = 'Erreur lors de la suppression du produit.';
            this.loading = false;
            console.error(error);

            // Message d'erreur si la suppression échoue
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression.',
              confirmButtonText: 'D\'accord'
            });
          }
        );
      }
    });
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Chatbot
  chatOpen: boolean = false;
  userMessage: string = '';
  messages: { role: 'user' | 'bot', content: string }[] = [
    { role: 'bot', content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?' }
  ];

  loadings: boolean = false;

  // Liste des mots-clés pour la détection des besoins
  keywords = {
    'produit': ['produit', 'acheter', 'choisir', 'prix', 'prix du produit'],
    'assistance': ['aide', 'problème', 'assistance', 'difficulté', 'support'],
    'avis': ['avis', 'témoignage', 'recommandation', 'retour', 'test'],
    'salutation': ['bonjour', 'salut', 'salutations', 'hello', 'hi'],
    'émotion': ['ça va', 'comment ça va', 'comment vas-tu', 'ça roule', 'ça va bien', 'bien', 'super'],
    'au revoir': ['au revoir', 'à bientôt', 'à plus', 'bye', 'salut']

  };

  // Fonction pour envoyer un message
  async sendMessage(): Promise<void> {
    if (!this.userMessage.trim()) return;

    const messageToSend = this.userMessage.trim();
    this.messages.push({ role: 'user', content: messageToSend });

    if (this.filterInappropriateLanguage(messageToSend)) {
      this.messages.push({ role: 'bot', content: 'Je ne peux pas répondre à cela.' });
      this.userMessage = '';
      return;
    }
    this.loading = true;

    // 👉 Appel GPT ici
    const response = await this.sendToAI(messageToSend, this.products);
    this.messages.push({ role: 'bot', content: response });

    this.loading = false;
    this.userMessage = '';

    const detectedIntent = this.detectIntent(messageToSend);

    // Process the detected intent
    const personalizedResponse = this.getPersonalizedResponse(detectedIntent);
    this.messages.push({ role: 'bot', content: personalizedResponse });
    // Clear user message after sending
  }


  // Fonction pour envoyer un message avec gestion du retry en cas d'erreur 429
  async sendToAI(message: string, produits: Product[]): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-goog-api-key': environment.googleApiKey
    });

    const produitsInfo = produits.map(p =>
      `Nom: ${p.nom}, Prix: ${p.prix}€, Description: ${p.description}, categorie: ${p.category}`
    ).join('\n');

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `
Tu es un assistant intelligent francophone.
Voici une liste de produits disponibles :
${produitsInfo}

Ta tâche est d'aider les clients à comparer ces produits, à comprendre leurs différences de prix ou de fonctionnalités, et à leur proposer celui qui correspond le mieux à leurs besoins.

Question du client : ${message}
` }
          ]
        }
      ]
    };

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    try {
      const response: any = await this.http.post(url, body, { headers }).toPromise();

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        return text;
      } else {
        return "Désolé, je n'ai pas compris votre demande.";
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'appel à l\'API Gemini:', error);

      if (error.status === 429) {
        return "Je suis un peu occupé en ce moment. Veuillez réessayer dans un instant.";
      } else {
        return "Une erreur est survenue lors de la communication avec l'IA.";
      }
    }
  }

  // Fonction pour détecter l'intention de l'utilisateur
  detectIntent(message: string): string {
    message = message.toLowerCase();

    for (const [intent, keywords] of Object.entries(this.keywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }

    return '';  
  }

  getPersonalizedResponse(intent: string, produits: any[] = [], categorie: string = ''): string {
    switch (intent) {
      case 'produit':
        return 'Vous souhaitez en savoir plus sur un produit ? Quel produit vous intéresse ?';

      case 'produit_categorie':
        if (produits.length === 0) return `Aucun produit trouvé dans la catégorie "${categorie}".`;
        return `Voici les produits disponibles dans la catégorie **${categorie}** :\n\n${produits
          .map(p => `- **${p.nom}** : ${p.description}`)
          .join('\n')}`;

      case 'assistance':
        return 'Je suis là pour vous aider, quel problème rencontrez-vous ?';
      case 'avis':
        return 'Voulez-vous voir des avis sur un produit ?';
      case 'salutation':
        return 'Bonjour ! 😊 Comment puis-je vous aider aujourd\'hui ?';
      case 'émotion':
        return 'Ça va bien, merci de demander ! Et toi, comment vas-tu ?';
      case 'au revoir':
        return 'Au revoir ! À bientôt ! 👋';
      default:
        return 'Je n\'ai pas compris, pouvez-vous reformuler ?';
    }
  }


  // Fonction pour filtrer les messages inappropriés
  filterInappropriateLanguage(message: string): boolean {
    const forbiddenWords = ["abruti", "connard", "pute", "salope", "merde", "enculé", "chier", "cul", "imbécile"];
    const lowerMsg = message.toLowerCase();
    return forbiddenWords.some(word => lowerMsg.includes(word));
  }

  isChatLoading: boolean = false;

  chatExpanded = false;  // Ajouter cette ligne

  // Méthode pour ouvrir/fermer le chatbot
  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  // Méthode pour agrandir/réduire la fenêtre du chatbot
  toggleExpand() {
    this.chatExpanded = !this.chatExpanded;
  }



}