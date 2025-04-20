import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../Services/FrontOffice/product-service.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';

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
    private router: Router 
  ) {
    this.productForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      stock: [5, [Validators.required, Validators.min(0)]],
      lowStockThreshold: [0, [Validators.required, Validators.min(0)]],
      alertSent: [false],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Mise à jour de la validation de la quantité à chaque changement de stock
    this.productForm.get('stock')?.valueChanges.subscribe(stock => {
      const quantityControl = this.productForm.get('quantity');
      if (quantityControl) {
        quantityControl.setValidators([Validators.required, Validators.min(1), Validators.max(stock)]);
        quantityControl.updateValueAndValidity();
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

  onSubmit() {
    if (this.productForm.invalid || !this.selectedFile) {
      alert('Veuillez remplir correctement le formulaire et sélectionner une image.');
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

    this.http.post('http://localhost:8011/api/products', formData).subscribe(
      (response) => {
        console.log('Produit ajouté avec succès', response);
        // Afficher un message de succès avec SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Produit ajouté!',
          text: 'Le produit a été ajouté avec succès.',
          confirmButtonText: 'D\'accord'
        }).then(() => {
          // Redirection vers la page des produits après le succès
          this.router.navigate(['/products']);
        });
        this.resetForm(); // Réinitialiser le formulaire après succès
      },
      (error) => {
        console.error('Erreur lors de l\'ajout :', error);
        // Afficher un message d'erreur avec SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de l\'ajout du produit. Veuillez réessayer.',
          confirmButtonText: 'Fermer'
        });
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
