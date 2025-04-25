import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../Services/product-service.service';
import { FormBuilder, FormGroup, Validators, AbstractControl  } from '@angular/forms';
import Swal from 'sweetalert2'; // Importation de SweetAlert2

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId!: number;
  product: any;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0.01), Validators.pattern('^\\d+(\\.\\d{1,2})?$')]],  // Ajout de la validation du prix avec deux décimales max
      category: ['cat1', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      lowStockThreshold: [0, Validators.min(0)],
      image: ['']
    });
    
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product) => {
        console.log('Produit récupéré:', product);
        console.log('Valeur de product.category:', product.category);

        const categoryMapping: { [key: string]: string } = {
          alimentation: 'cat1',
          accessoires: 'cat2',
          hygiene: 'cat3',
          sante: 'cat4',
          habitat: 'cat5'
        };

        const mappedCategory = categoryMapping[product.category] || product.category;
        const lowStockThreshold = product.lowStockThreshold > product.stock ? product.stock : product.lowStockThreshold;


        this.productForm.patchValue({
          nom: product.nom,
          description: product.description,
          prix: Number(product.prix), 
          category: mappedCategory,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          image: ''
        });

        this.imagePreview = `http://localhost:8011/api/products/images/${product.imageUrl}`;
      },
      (error) => {
        console.error('Erreur lors de la récupération du produit:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.productForm.patchValue({ image: file });
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  stockThresholdValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const stock = control.get('stock')?.value;
    const lowStockThreshold = control.get('lowStockThreshold')?.value;
  
    if (lowStockThreshold > stock) {
      return { 'lowStockThresholdExceedsStock': true };
    }
    return null;
  }
  

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValues = this.productForm.value;
      const formData = new FormData();
  
      formData.append('nom', formValues.nom);
      formData.append('description', formValues.description);
      formData.append('prix', Number(formValues.prix).toString()); 
      formData.append('category', formValues.category);
      formData.append('stock', formValues.stock.toString());
      formData.append('quantity', formValues.lowStockThreshold.toString());
  
      if (formValues.image instanceof File) {
        formData.append('image', formValues.image);
      }
  
      this.productService.updateProduct(this.productId, formData).subscribe(
        () => {
          // SweetAlert2 popup de succès
          Swal.fire({
            icon: 'success',
            title: 'Produit mis à jour avec succès !',
            showConfirmButton: false,
            timer: 1500 // Popup qui disparaît après 1,5 seconde
          }).then(() => {
            // Redirection vers la liste des produits après le succès
            this.router.navigate(['/produit']);
          });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit:', error);
        }
      );
    }
  }

  onCancel(): void {
    window.history.back();
  }

  getCategoryLabel(categoryValue: string): string {
    const categoryLabels: { [key: string]: string } = {
      cat1: 'Alimentation',
      cat2: 'Accessoires',
      cat3: 'Hygiène et soins',
      cat4: 'Santé',
      cat5: 'Habitat'
    };
    return categoryLabels[categoryValue] || 'Inconnue';
  }
}
