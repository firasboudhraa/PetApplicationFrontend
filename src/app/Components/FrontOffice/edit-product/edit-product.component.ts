import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductServiceService } from '../../../Services/FrontOffice/product-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId !: number;
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(1)]],
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
        console.log('Valeur de product.category:', product.category); // Vérifiez la valeur ici
  
        const categoryMapping: { [key: string]: string } = {
          alimentation: 'cat1',
          accessoires: 'cat2',
          hygiene: 'cat3',
          sante: 'cat4',
          habitat: 'cat5'
        };
  
        const mappedCategory = categoryMapping[product.category] || product.category;
  
        this.productForm.patchValue({
          nom: product.nom,
          description: product.description,
          prix: product.prix,
          category: mappedCategory, // Utilisez la catégorie mappée
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          image: product.imageUrl
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération du produit:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe(
        (response) => {
          alert('Produit mis à jour avec succès !');
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit:', error);
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.productForm.patchValue({ image: reader.result }); // Met à jour le champ image
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel(): void {
    // Redirige l'utilisateur vers la liste des produits ou une autre page
    window.history.back();
  }


  getCategoryLabel(categoryValue: string): string {
    console.log('Valeur de categoryValue:', categoryValue); // Vérifiez la valeur ici
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