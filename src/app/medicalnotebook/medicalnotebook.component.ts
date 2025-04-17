import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Carnet } from '../models/carnet';
import { RecordTypeEnum } from '../models/recordtypeEnum';
import { MedicalService } from '../Services/medical.service';
import { forkJoin, map, catchError, of } from 'rxjs';
import { FullCarnetResponse } from '../models/records';
import { Record } from 'src/app/models/records';  // Assure-toi d'importer le bon modèle


@Component({
  selector: 'app-medicalnotebook',
  templateUrl: './medicalnotebook.component.html',
  styleUrls: ['./medicalnotebook.component.css']
})
export class MedicalnotebookComponent implements OnInit {
navigateToagenda() {
  this.router.navigate(['/agenda']);
}
record: any;
editRecord(record: any): void {
  if (record && record.id !== undefined && record.id !== null) {
    console.log("✅ ID reçu :", record.id);
    this.router.navigate(['/edit-record', record.id]);
  } else {
    console.error("❌ Record ID is missing:", record);
    alert("Impossible d'éditer cet enregistrement : ID manquant.");
  }
}

navigateToMedicalNotebookStats() {
  this.router.navigate(['/stats']);
}
  constructor(private router: Router,private medicalService: MedicalService,private act:ActivatedRoute) {}

  carnets !: any[] 
  id!:number
  
 
  goToDetails(carnet: any) {
    console.log('Carnet reçu :', carnet);  // Vérifie la structure de l'objet
    if (carnet && carnet.name) {  // Vérifie si le carnet a un nom
      // Récupère tous les carnets via getAllCarnets
      this.medicalService.getAllCarnets().subscribe({
        next: (data) => {
          // Cherche l'ID du carnet dans la liste récupérée
          const carnetTrouve = data.find((c) => c.name === carnet.name);
          console.log('Carnet trouvé:', carnetTrouve);  // Vérifie la structure de l'objet trouvé
          
          if (carnetTrouve && carnetTrouve.id) {
            // Si un carnet correspondant est trouvé avec un ID, navigue vers la page de détails
            this.router.navigate(['/details', carnetTrouve.id]);
          } else {
            console.error('Carnet avec l\'ID introuvable pour le nom:', carnet.name);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des carnets:', err);
        }
      });
    } else {
      console.error('Impossible de naviguer : le carnet n\'a pas de nom ou d\'ID');
    }
  }
  
  
  
  
  ngOnInit(): void {
    this.id=this.act.snapshot.params['id']
    console.log(this.id)

    this.loadCarnets();
    this.loadCarnets_test();
    this.loadRecords();
  }
  
  filtered_Carnets: FullCarnetResponse[] = [];
  allCarnets: FullCarnetResponse[] = [];

  currentRecordIndex: { [carnetName: string]: number } = {};

  loadRecords(): void {
    this.medicalService.getAllRecords().subscribe({
      next: (data) => {
        this.record = data.map(record => ({
          id: record['id'],
          date: new Date(record['dateTime']),
          type: record['type'],
          description: record['description'],
          poids: record['poids'],
          next_due_date: record['next_due_date'] ? new Date(record['next_due_date']) : null,
          carnet_id: record['carnet_id']
        }));
        console.log("Tous les records chargés :", this.record);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des records :", err);
      }
    });
  }

  // Charger la liste des carnets médicaux
  loadCarnets(): void {
    this.medicalService.getAllCarnets().subscribe({
      next: (data) => {
        console.log('Carnets récupérés:', data);  // Vérifie la structure ici
        
        this.carnets = []; // Réinitialise la liste des carnets
        const carnetRequests = data.map(carnet => {  
          return this.medicalService.getMedicalRecordsByCarnetId(carnet.id).pipe(
            map(response => {
              console.log('Réponse des records pour le carnet test test', carnet.id, response);  // Affiche la réponse pour vérifier la structure
              
              // Vérifier si 'medicalRecords' existe et est un tableau
              if (Array.isArray(response)) {
                carnet.medicalRecords = response.map(record => ({
                  date: new Date(record['dateTime']),
                  type: record['type'],
                  description: record['description'],
                  next_due_date: record['next_due_date'] ? new Date(record['next_due_date']) : new Date(0),
                  carnet_id: record['carnetId'],
                  poids:record['poids'],
                }));
              } else {
                carnet.medicalHistory = []; // Si 'response' n'est pas un tableau, initialiser avec un tableau vide
              }
              return response; // Retourner le carnet avec ses records
            }),
            catchError(err => {
              console.error('Erreur lors de la récupération des records pour le carnet ID:', carnet.id, err);
              return of(null); // Retourner null en cas d'erreur
            })
          );
        });
    
        // Utilisation de forkJoin pour attendre que toutes les requêtes se terminent
        forkJoin(carnetRequests).subscribe({
          next: (carnetsWithRecords) => {
            // Filtrer les carnets avec des résultats valides
            this.carnets = carnetsWithRecords.filter(carnet => carnet !== null);
            console.log('Carnets avec historiques:', this.carnets);
          },
          error: (err) => {
            console.error('Erreur lors du chargement des carnets avec les historiques', err);
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des carnets', error);
      }
    });
  }
  

  
  
  loadCarnets_test(): void {
    this.medicalService.getAllCarnets().subscribe({
      next: (data) => {
        this.carnets = data;
        console.log('Carnets récupérés:', this.carnets);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des carnets', err);
      }
    });
  }

    medicalRecords: Record[] = [];  // Utilisation du modèle Record explicite
  
  loadMedicalRecords(): void {
    this.medicalService.getAllRecords().subscribe(
      (response) => {
        this.medicalRecords = response.map((item: any) => ({
          id: item.id, // Include 'id' property
          date: item.date, // Add 'date' property
          dateTime: item.date, // Renamed 'date' to 'dateTime'
          type: item.type,
          description: item.description,
          next_due_date: item.next_due_date,
          carnet_id: item.carnet_id,
          poids: item.poids,
          nextDate: item.next_due_date ? new Date(item.next_due_date).toISOString() : '', // Add 'nextDate' property
        })); // Stocker la réponse dans la variable
        console.log('Records médicaux récupérés testest:', this.medicalRecords); // Vérifiez que vous recevez la liste correcte
      },
      (error) => {
        console.error('Erreur lors de la récupération des carnets médicaux', error);
      }
    );
  }





 
  
  deleteCarnet(carnet: any) {
    console.log('Carnet reçu pour suppression:', carnet);  // Log de l'objet complet
  
 
  
    console.log('ID reçu pour suppression:', carnet.id);
  
    // Si tu veux t'assurer que les carnets sont récupérés avant de procéder à la suppression
    this.medicalService.getAllCarnets().subscribe({
      next: (data) => {
        this.carnets = data;
        console.log('Carnets récupérés:', this.carnets);
  
        // Vérifie si le carnet existe dans la liste des carnets
        const carnetToDelete = this.carnets.find(c => c.id === carnet.id);
        if (carnetToDelete) {
          console.log('Carnet trouvé pour suppression:', carnetToDelete); // Log le carnet à supprimer
          // Effectuer la suppression avec l'ID du carnet
          this.medicalService.deleteCarnet(carnetToDelete.id).subscribe({
            next: () => {
              console.log('Suppression réussie pour le carnet avec ID:', carnetToDelete.id);
              this.loadCarnets(); // Recharge la liste des carnets après suppression
            },
            error: err => {
              console.error('Erreur lors de la suppression du carnet', err);
            }
          });
        } else {
          console.error('Carnet non trouvé dans la liste');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des carnets', err);
      }
    });
  }
  
  
  
  navigateToMedicalNotebookForm(): void {
    this.router.navigate(['/medicalnotebookform']);
  }
  
  searchText: string = '';
  searchDate: string = '';
  searchType: string = '';
searchVet: string = '';
searchMonth: string = '';
searchStartDate: string = '';
searchEndDate: string = '';

  
  // ✅ Getter pour filtrer dynamiquement les carnets selon le nom et la date
  get filteredCarnets(): any[] {
    return this.carnets.filter(carnet => {
      const matchesName =
        !this.searchText || carnet.name?.toLowerCase().includes(this.searchText.toLowerCase());
  
      const matchesDate =
        !this.searchDate ||
        (carnet.medicalRecords &&
          carnet.medicalRecords.some((record: any) =>
            new Date(record.dateTime).toISOString().split('T')[0] === this.searchDate
          ));
  
      const matchesType =
        !this.searchType ||
        (carnet.medicalRecords &&
          carnet.medicalRecords.some((record: any) =>
            record.type?.toLowerCase() === this.searchType.toLowerCase()
          ));
  
      const matchesVet =
        !this.searchVet ||
        (carnet.medicalRecords &&
          carnet.medicalRecords.some((record: any) =>
            record.veterinarian_id?.toLowerCase().includes(this.searchVet.toLowerCase())
          ));
  
      const matchesMonth =
        !this.searchMonth ||
        (carnet.medicalRecords &&
          carnet.medicalRecords.some((record: any) => {
            const recordMonth = new Date(record.dateTime).toISOString().slice(0, 7); // format YYYY-MM
            return recordMonth === this.searchMonth;
          }));
  
      const matchesPeriod =
        (!this.searchStartDate && !this.searchEndDate) ||
        (carnet.medicalRecords &&
          carnet.medicalRecords.some((record: any) => {
            const recordDate = new Date(record.dateTime);
            const startDate = this.searchStartDate ? new Date(this.searchStartDate) : null;
            const endDate = this.searchEndDate ? new Date(this.searchEndDate) : null;
            return (!startDate || recordDate >= startDate) &&
                   (!endDate || recordDate <= endDate);
          }));
  
      return matchesName && matchesDate && matchesType && matchesVet && matchesMonth && matchesPeriod;
    });
  }
  

  resetFilters(): void {
    this.searchText = '';
    this.searchDate = '';
    this.searchType = '';
    this.searchVet = '';
    this.searchMonth = '';
  }
  
  

  searchText1: string = '';
  searchDate1: string = '';
  
  

// Dictionnaire pour garder l’état par carnet
expandedCarnets: { [id: string]: boolean } = {};

// Toggle d’un carnet spécifique
toggleExpanded(id: string) {
  this.expandedCarnets[id] = !this.expandedCarnets[id];
}

// Vérifie si un carnet est développé
isExpanded(id: string): boolean {
  return !!this.expandedCarnets[id];
}
expandedIndex: boolean[] = [];

toggle(index: number): void {
  this.expandedIndex[index] = !this.expandedIndex[index];
}
  

}
