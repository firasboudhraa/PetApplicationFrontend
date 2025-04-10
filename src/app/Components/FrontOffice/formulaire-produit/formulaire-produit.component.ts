import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductServiceService } from '../../../Services/FrontOffice/product-service.service';

@Component({
  selector: 'app-formulaire-produit',
  templateUrl: './formulaire-produit.component.html',
  styleUrls: ['./formulaire-produit.component.css']
})
export class FormulaireProduitComponent implements OnInit {

  showForm: boolean = false;
  productForm: FormGroup;
  selectedFile: File | null = null;
  isLoading: boolean = false; // Indicateur de chargement

  constructor(private productService: ProductServiceService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      stock: [5, [Validators.required, Validators.min(0)]],
      lowStockThreshold: [0, [Validators.required, Validators.min(0)]],
      alertSent: [false, Validators.required]
    });
  }

  ngOnInit(): void {}

  // Gérer la sélection du fichier image
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.productForm.invalid) {
      alert('Veuillez remplir correctement le formulaire.');
      return;
    }
  
    if (!this.selectedFile) {
      alert('Veuillez sélectionner une image.');
      return;
    }
  
    console.log('Données du formulaire :', this.productForm.value);
    console.log('Fichier sélectionné :', this.selectedFile);
  
    this.isLoading = true; // Début du chargement
  
    const formData = new FormData();
    formData.append('nom', this.productForm.value.nom);
    formData.append('description', this.productForm.value.description);
    formData.append('prix', this.productForm.value.prix.toString());
    formData.append('category', this.productForm.value.category);
    formData.append('stock', this.productForm.value.stock.toString());
    formData.append('lowStockThreshold', this.productForm.value.lowStockThreshold.toString());
    formData.append('alertSent', this.productForm.value.alertSent.toString());
  
    // Ajout du fichier image
    formData.append('image', this.selectedFile, this.selectedFile.name);
  
    console.log('FormData envoyé :', formData);
  
    // Ajout d'un produit
    this.productService.createProductWithFormData(formData).subscribe(
      response => {
        console.log('Produit ajouté avec succès', response);
        alert('Produit ajouté avec succès.');
        this.resetForm();
        this.isLoading = false; // Fin du chargement
      },
      error => {
        console.error('Erreur lors de l\'ajout :', error);
        alert('Erreur lors de l\'ajout du produit.');
        this.isLoading = false; // Fin du chargement même en cas d'erreur
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
      alertSent: false
    });
    this.selectedFile = null; // Réinitialiser le fichier sélectionné
    this.isLoading = false; // Réinitialiser l'indicateur de chargement
  }
}