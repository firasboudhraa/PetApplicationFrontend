import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Carnet } from '../models/carnet';
import { RecordTypeEnum } from '../models/recordtypeEnum';
import { MedicalService } from '../Services/medical.service';
import { forkJoin, map, catchError, of } from 'rxjs';


@Component({
  selector: 'app-medicalnotebook',
  templateUrl: './medicalnotebook.component.html',
  styleUrls: ['./medicalnotebook.component.css']
})
export class MedicalnotebookComponent implements OnInit {
  constructor(private router: Router,private medicalService: MedicalService,private act:ActivatedRoute) {}

  carnets !: any[] 
  id!:number
  /*
  ngOnInit(): void {
    this.medicalService.getCarnetsWithRecords().subscribe({
      next: (data: Carnet[]) => {
        this.carnets = data;
        console.log('Carnets avec historiques:', this.carnets);
      },
      error: (err: any) => {
        console.error('Erreur chargement carnets/records', err);
      }
    });
  }*/

  ngOnInit(): void {
    this.id=this.act.snapshot.params['id']
    console.log(this.id)

    this.loadCarnets();
    this.loadCarnets_test();
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
              console.log('Réponse des records pour le carnet', carnet.id, response);  // Affiche la réponse pour vérifier la structure
              
              // Vérifier si 'medicalRecords' existe et est un tableau
              if (Array.isArray(response)) {
                carnet.medicalHistory = response.map(record => ({
                  
                  // Assurer que 'name' existe dans la réponse
                  date: new Date(record['dateTime']),
                  type: record['type'],  // Assurer que 'type' existe dans la réponse
                  description: record['description'],
                  next_due_date: record['next_due_date'] ? new Date(record['next_due_date']) : new Date(0), // Date par défaut si pas de next_due_date
                  carnet_id: record['carnetId']  // Vérifie que 'carnetId' est bien une clé
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
  
  // ✅ Getter pour filtrer dynamiquement les carnets selon le nom et la date
  get filteredCarnets(): any[] {
    return this.carnets.filter(carnet => {
      const matchesName =
        !this.searchText || carnet.name?.toLowerCase().includes(this.searchText.toLowerCase());
  
      const matchesDate =
        !this.searchDate ||
        (carnet.medicalRecords &&
          carnet.medicalRecords.some((record: { dateTime: string | number | Date; }) => {
            const recordDate = new Date(record.dateTime).toISOString().split('T ')[0];
            return recordDate === this.searchDate;
          })
        );
  
      return matchesName && matchesDate;
    });
  }
  

  searchText1: string = '';
  searchDate1: string = '';
  searchType: string = '';
  searchVet: string = '';
  
}