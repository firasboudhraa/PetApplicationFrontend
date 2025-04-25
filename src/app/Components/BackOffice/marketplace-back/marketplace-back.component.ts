import { Component } from '@angular/core';
import { Marketplace } from 'src/app/models/marketplace';
import { Product } from 'src/app/models/product';
import { MarketplaceService } from 'src/app/Services/marketplace.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marketplace-back',
  templateUrl: './marketplace-back.component.html',
  styleUrls: ['./marketplace-back.component.css']
})
export class MarketplaceBackComponent {
  marketplaces: Marketplace[] = [];
  uniqueMarketplace: Marketplace | null = null;
  products: Product[] = [];
  errorMessage: string | null = null;
  marketplaceId: number | null = null;
  isEditMode: boolean = false;
  showForm: boolean = false;
  marketplace: Marketplace = { id_Marketplace: 0, name: '', description: '', dateCreation: new Date(), statut: '' };

  constructor(private marketplaceService: MarketplaceService) { }

  ngOnInit(): void {
    this.loadMarketplaces();
  }

  toggleCreateForm() {
    // Vérifie s'il existe déjà une marketplace
    if (this.marketplaces.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Marketplace already exists',
        text: 'You cannot create more than one marketplace.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    // Affiche le formulaire dans un SweetAlert
    Swal.fire({
      title: 'Create Marketplace',
      html:
        `<input id="swal-name" class="swal2-input" placeholder="Name">` +
        `<input id="swal-description" class="swal2-input" placeholder="Description">` +
        `<input id="swal-statut" class="swal2-input" placeholder="Statut (active)">`,
      focusConfirm: false,
      confirmButtonText: 'Create',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('swal-description') as HTMLInputElement).value.trim();
        const statut = (document.getElementById('swal-statut') as HTMLInputElement).value.trim().toLowerCase();
  
        if (!name || !description || !statut) {
          Swal.showValidationMessage('Tous les champs sont obligatoires.');
          return false;
        }
  
        if (name.length < 5 || description.length < 5 || statut.length < 5) {
          Swal.showValidationMessage('Chaque champ doit contenir au moins 5 caractères.');
          return false;
        }
  
        if (statut !== 'active') {
          Swal.showValidationMessage("Le statut doit être exactement 'active'.");
          return false;
        }
  
        return { name, description, statut };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Crée l'objet marketplace
        this.marketplace = {
          name: result.value.name,
          description: result.value.description,
          statut: result.value.statut,
          dateCreation: new Date()
        };
  
        // Soumet les données
        this.submitMarketplaceForm();
      }
    });
  }
  

  loadMarketplaces(): void {
    this.marketplaceService.getAllMarketplaces().subscribe({
      next: (data) => {
        this.marketplaces = data;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des marketplaces';
        console.error(err);
      }
    });
  }

  searchMarketplaceById(): void {
    console.log('Searching for marketplace with ID:', this.marketplaceId); // Log ajouté
  
    if (this.marketplaceId !== null && this.marketplaceId !== undefined) {
      this.marketplaceService.getMarketplaceById(this.marketplaceId).subscribe({
        next: (data) => {
          this.uniqueMarketplace = data;
          console.log('Marketplace found:', this.uniqueMarketplace); // Log ajouté
  
          // Affichage d'une alerte SweetAlert avec les détails du marketplace sous forme de carte
          Swal.fire({
            title: 'Marketplace Trouvé',
            html: `
              <div style="width: 350px; padding: 20px; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 auto;">
                <h3 style="margin-bottom: 15px; color: #333; text-align: center;">${this.uniqueMarketplace.name}</h3>
                <div style="margin-bottom: 10px;">
                  <strong style="color: #555;">Description:</strong>
                  <p style="margin: 5px 0; font-size: 14px; color: #666; text-align: center;">${this.uniqueMarketplace.description}</p>
                </div>
                <div style="margin-bottom: 10px;">
                  <strong style="color: #555;">Statut:</strong>
                  <p style="margin: 5px 0; font-size: 14px; color: #666; text-align: center;">${this.uniqueMarketplace.statut}</p>
                </div>
                <div style="margin-bottom: 20px;">
                  <strong style="color: #555;">Date de création:</strong>
                  <p style="margin: 5px 0; font-size: 14px; color: #666; text-align: center;">${this.uniqueMarketplace.dateCreation}</p>
                </div>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'confirm-button'
            }
          });
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la recherche de la marketplace';
          console.error(err);
  
          // Affichage d'une alerte d'erreur si la recherche échoue
          Swal.fire({
            title: 'Erreur',
            text: 'L\'ID de la marketplace est invalide !',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      this.errorMessage = 'L\'ID de la marketplace est invalide';
  
      // Affichage d'une alerte si l'ID est invalide
      Swal.fire({
        title: 'ID Invalide',
        text: 'Veuillez entrer un ID valide.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  
  
  
  


  editMarketplace(id: number | undefined): void {
    if (id === undefined) {
      console.error("ID is undefined");
      return;
    }
  
    // Récupérer le marketplace par son ID
    this.marketplaceService.getMarketplaceById(id).subscribe({
      next: (marketplace) => {
        Swal.fire({
          title: 'Modifier le Marketplace',
          html:
            `<input id="swal-input-name" class="swal2-input" placeholder="Nom" value="${marketplace.name}">` +
            `<input id="swal-input-description" class="swal2-input" placeholder="Description" value="${marketplace.description}">` +
            `<input id="swal-input-statut" class="swal2-input" placeholder="Statut" value="${marketplace.statut}">`,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Enregistrer',
          cancelButtonText: 'Annuler',
          preConfirm: () => {
            const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
            const description = (document.getElementById('swal-input-description') as HTMLInputElement).value;
            const statut = (document.getElementById('swal-input-statut') as HTMLInputElement).value;
  
            if (!name || !description || !statut) {
              Swal.showValidationMessage('Tous les champs sont requis');
              return false;
            }

            
          if (name.length < 5 || description.length < 5 || statut.length < 5) {
            Swal.showValidationMessage('Chaque champ doit contenir au moins 5 caractères.');
            return false;
          }

          if (statut !== 'active') {
            Swal.showValidationMessage("Le statut doit être 'active'.");
            return false;
          }
  
            return { name, description, statut };
          }
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const updatedMarketplace = {
              ...marketplace,
              name: result.value.name,
              description: result.value.description,
              statut: result.value.statut
            };
  
            this.marketplaceService.updateMarketplace(id, updatedMarketplace).subscribe({
              next: () => {
                this.loadMarketplaces();
                Swal.fire('Succès', 'Le marketplace a été mis à jour avec succès.', 'success');
              },
              error: (err) => {
                console.error(err);
                Swal.fire('Erreur', 'Échec de la mise à jour du marketplace.', 'error');
              }
            });
          }
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Erreur', 'Impossible de récupérer les données du marketplace.', 'error');
      }
    });
  }
  

  deleteMarketplace(id: number | undefined): void {
    if (id !== undefined) {
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Cette action supprimera définitivement le marketplace et tous ses produits associés.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          // Supprimer directement le marketplace
          this.marketplaceService.deleteMarketplace(id).subscribe({
            next: () => {
              Swal.fire('Supprimé', 'Le marketplace a été supprimé avec succès.', 'success');
            },
            error: (err) => {
              console.error(err);
              Swal.fire('Erreur', 'Échec de la suppression du marketplace.', 'error');
            }
          });
        }
      });
    } else {
      console.error("ID is undefined");
    }
  }
  
  
  


  cancelEdit(): void {
    this.isEditMode = false;
    this.showForm = false;
    // Réinitialiser l'objet marketplace pour éviter de garder les anciennes données
    this.marketplace = { id_Marketplace: 0, name: '', description: '', dateCreation: new Date(), statut: '' };
}

submitMarketplaceForm() {
  if (this.marketplaces.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Navré !',
      text: 'Il ne peut y avoir qu\'une seule marketplace.',
      confirmButtonColor: '#dc3545'
    });
    return;
  }

  this.marketplaceService.createMarketplace(this.marketplace).subscribe({
    next: (data) => {
      this.marketplaces.push(data);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Votre marketplace a été créée avec succès !',
        confirmButtonColor: '#28a745'
      });
    },
    error: (error) => {
      console.error('Erreur lors de la création :', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de créer la marketplace. Veuillez réessayer.',
        confirmButtonColor: '#dc3545'
      });
    }
  });
}

}
