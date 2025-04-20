import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Services/FrontOffice/product-service.service';
import { Product } from '../../../models/product'; 
import { Basket } from '../../../models/basket';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BasketService } from '../../../Services/FrontOffice/basket.service'; 

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
    quantity: 0
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
              private basketService: BasketService) {}

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
    console.log('ID du panier:', this.basketIds[productId]); // Vérifie la valeur du panier
  
    // Vérification si le panier sélectionné est valide
    if (!this.basketIds[productId]) {
      // Affichage d'un message d'erreur avec SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Panier non sélectionné',
        text: 'Veuillez sélectionner un panier avant d\'ajouter un produit.',
        confirmButtonText: 'D\'accord'
      });
      return;
    }
  
    // Appel au service pour ajouter le produit au panier
    this.basketService.addProductToBasket(this.basketIds[productId], productId).subscribe(
      (response) => {
        // Affichage du message de succès avec SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Produit ajouté',
          text: 'Produit ajouté au panier avec succès!',
          confirmButtonText: 'D\'accord'
        });
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du produit au panier:', error);
        // Affichage du message d'erreur avec SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'ajout du produit.',
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
          quantity: 0
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
          quantity: 0
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

 // ✅ Chatbot
chatOpen: boolean = false;
userMessage: string = '';
messages: { role: 'user' | 'bot', content: string }[] = [
  { role: 'bot', content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?' }
];

loadings: boolean = false;
openAiApiKey: string = '';  // Remplace par ta clé API

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

  // Détection des mots-clés
  const detectedIntent = this.detectIntent(messageToSend);

  if (this.filterInappropriateLanguage(messageToSend)) {
    this.messages.push({ role: 'bot', content: "Je préfère ne pas répondre à ce genre de langage." });
    this.userMessage = '';
    return;
  }

  // Ajoute le message de l'utilisateur
  this.messages.push({ role: 'user', content: messageToSend });
  this.userMessage = '';
  this.loadings = true;

  try {
    // Tentative d'appel à l'API OpenAI avec un mécanisme de retry en cas d'erreur 429
    const response = await this.sendMessageWithRetry(messageToSend, detectedIntent);

    const botReply = response.data.choices[0].message.content;

    // Ajoute la réponse du bot en fonction de l'intention détectée
    this.messages.push({ role: 'bot', content: this.getPersonalizedResponse(detectedIntent, botReply) });

  } catch (error) {
    console.error('Erreur avec l\'API OpenAI:', error);
    this.messages.push({ role: 'bot', content: "Désolé, une erreur s'est produite." });
  } finally {
    this.loadings = false;
  }
}

// Fonction pour envoyer un message avec gestion du retry en cas d'erreur 429
async sendMessageWithRetry(messageToSend: string, detectedIntent: string): Promise<any> {
  let attempts = 0;
  const maxAttempts = 5;
  const retryDelay = 2000; // Délai en millisecondes (2 secondes)

  while (attempts < maxAttempts) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Vous êtes un assistant virtuel dynamique. Répondez de manière courtoise, fluide et engageante.' },
            { role: 'user', content: messageToSend }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openAiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response;  // Si la requête réussit, retourne la réponse
    } catch (error: unknown) {
      // Vérification si l'erreur est une instance d'AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 429) {
          // Si le code d'erreur est 429, attend avant de réessayer
          attempts++;
          console.log(`Trop de requêtes. Tentative ${attempts} de ${maxAttempts}. Attente de ${retryDelay / 1000} secondes...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay)); // Attente avant réessai
        } else {
          // Si ce n'est pas une erreur 429, on la gère normalement
          console.error('Erreur Axios non 429:', error.message);
          throw error; // Relancer l'erreur pour gestion en dehors de la fonction
        }
      } else {
        // Si l'erreur n'est pas une AxiosError, on la gère comme une erreur inconnue
        console.error('Erreur inconnue:', error);
        throw error;
      }
    }
  }

  // Si on a atteint le nombre maximal de tentatives sans succès
  throw new Error('Échec des tentatives d\'appel à l\'API');
}

// Fonction pour détecter l'intention de l'utilisateur
detectIntent(message: string): string {
  message = message.toLowerCase();
  for (const [intent, keywords] of Object.entries(this.keywords)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return intent;
    }
  }
  return 'general';  // Si aucun mot-clé n'est trouvé, on renvoie 'general'
}

// Génère une réponse personnalisée selon l'intention détectée
getPersonalizedResponse(intent: string, botReply: string): string {
  switch (intent) {
    case 'produit':
      return `Je peux vous aider à choisir un produit. Voici ce que je peux vous proposer : ${botReply}`;
    case 'assistance':
      return `J'ai détecté que vous avez besoin d'assistance. Voici quelques options pour vous aider : ${botReply}`;
    case 'avis':
      return `Vous cherchez des avis sur un produit ? Voici ce que j'ai trouvé : ${botReply}`;
    case 'salutation':
      return `Bonjour ! 😊 Comment puis-je vous aider aujourd'hui ?`;
    case 'émotion':
      return `Ça va bien, merci de demander ! Et toi, comment vas-tu ?`;
    case 'au revoir':
      return `Au revoir ! À bientôt ! 👋`;
    default:
      return botReply;
  }
}

// Fonction pour filtrer les messages inappropriés
filterInappropriateLanguage(message: string): boolean {
  const forbiddenWords = ["abruti", "connard", "pute", "salope", "merde", "enculé", "chier", "cul", "imbécile"];
  const lowerMsg = message.toLowerCase();
  return forbiddenWords.some(word => lowerMsg.includes(word));
}

// Fonction pour ouvrir/fermer le chatbot
toggleChat(): void {
  this.chatOpen = !this.chatOpen;
}




}