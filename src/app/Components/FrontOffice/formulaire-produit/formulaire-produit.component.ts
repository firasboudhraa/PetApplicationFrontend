import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../Services/product-service.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { AuthService } from '../../FrontOffice/user/auth/auth.service';
import {UserService} from 'src/app/Services/user.service'


@Component({
  selector: 'app-formulaire-produit',
  templateUrl: './formulaire-produit.component.html',
  styleUrls: ['./formulaire-produit.component.css']
})
export class FormulaireProduitComponent implements OnInit {

  productForm: FormGroup;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private productService: ProductService, 
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: UserService, 
    private router: Router 
  ) {
    this.productForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3) ,Validators.maxLength(10)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      prix: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      stock: [5, [Validators.required, Validators.min(0)]],
      lowStockThreshold: [0, [Validators.required, Validators.min(0)]],
      alertSent: [false],
      quantity: [1, [Validators.required, Validators.pattern('^1$')]]
    });
    
  }

  ngOnInit(): void {
    // Mise à jour de la validation de la quantité à chaque changement de stock
    this.productForm.get('stock')?.valueChanges.subscribe(stock => {
      const quantityControl = this.productForm.get('quantity');
      // La quantité doit toujours être égale à 1
      quantityControl?.setValidators([Validators.required, Validators.pattern('^1$')]);
      quantityControl?.updateValueAndValidity();
    
      const lowStockControl = this.productForm.get('lowStockThreshold');
      // Mise à jour des validations du seuil d'alerte de stock
      lowStockControl?.setValidators([
        Validators.required, 
        Validators.min(0), 
        Validators.max(stock)  // Assure que le seuil d'alerte ne dépasse pas le stock
      ]);
      lowStockControl?.updateValueAndValidity();
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

  onSubmit() {
    if (this.productForm.invalid || !this.selectedFile) {
      alert('Veuillez remplir correctement le formulaire et sélectionner une image.');
      return;
    }
  
    const userId = this.authService.getCurrentUserId(); // 🔥 Récupération de l'ID utilisateur
  
    if (!userId) {
      alert("Utilisateur non connecté ou ID invalide !");
      return;
    }
  
    this.isLoading = true;
  
    const formData = new FormData();
    formData.append('nom', this.productForm.value.nom);
    formData.append('description', this.productForm.value.description);
    formData.append('prix', this.productForm.value.prix.toString());
    formData.append('stock', this.productForm.value.stock.toString());
    formData.append('category', this.productForm.value.category);
    formData.append('quantity', this.productForm.value.quantity.toString());
    formData.append('image', this.selectedFile, this.selectedFile.name);
  
    // Utilise l'URL correcte avec userId dans le chemin
    const url = `http://localhost:8011/api/products/user/${userId}`;
  
    this.http.post(url, formData).subscribe(
      (response) => {
        console.log('Produit ajouté avec succès', response);
        Swal.fire({
          icon: 'success',
          title: 'Produit ajouté!',
          text: 'Le produit a été ajouté avec succès.',
          confirmButtonText: 'D\'accord'
        }).then(() => {
          this.router.navigate(['/products']);
        });
        this.resetForm();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de l\'ajout :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de l\'ajout du produit. Veuillez réessayer.',
          confirmButtonText: 'Fermer'
        });
        this.isLoading = false;
      }
    );
  }

  resetForm() {
    this.productForm.reset({
      nom: '',
      description: '',
      prix: 0,
      category: '',
      stock: 5,
      lowStockThreshold: 0,
      alertSent: false,
      quantity: 1
    });
    this.selectedFile = null;
    this.previewImage = null;
    this.isLoading = false;
  }

  onReturnToProducts() {
    this.router.navigate(['/produit']);
  }
}
