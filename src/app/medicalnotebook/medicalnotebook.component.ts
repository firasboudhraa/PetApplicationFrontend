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
/*
  carnets_test = [
    { medicalHistory: 'Historique Médical 1', pet_name: 'hhgff1234' },
    { medicalHistory: 'Historique Médical 2', pet_name: 'vvvvv5678' },
    { medicalHistory: 'Historique Médical 3', pet_name: 'aaaaa91011' }
  ];

  carnets: Carnet[] = [
    {
      id: '1',
      pet_id: '325',
      medicalHistory: [
        {
          id: 'rec1',
          name: 'Carnet Médical Médor',
          date: new Date('2024-03-01'),
          type: RecordTypeEnum.VACCINATION, 
          description: 'Vaccination annuelle',
          veterinarian_id: 'vet001',
          next_due_date: new Date('2025-03-01'),
          carnet_id: '1'
        },
        {
          id: 'rec2',
          name: 'Carnet Médical Médor',
          date: new Date('2024-06-15'),
          type: RecordTypeEnum.CHECKUP, 
          description: 'Contrôle général',
          veterinarian_id: 'vet002',
          next_due_date: new Date('2024-12-15'),
          carnet_id: '1'
        }
      ]
    },
    {
      id: '2',
      pet_id: '123',
      medicalHistory: [
        {
          id: 'rec3',
          name: 'Carnet Médical Bella',
          date: new Date('2023-09-10'),
          type: RecordTypeEnum.SURGERY, 
          description: 'Opération des ligaments croisés',
          veterinarian_id: 'vet003',
          next_due_date: new Date('2024-09-10'),
          carnet_id: '2'
        }
      ]
    }
  ];*/
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
  }

  // Charger la liste des carnets médicaux
  loadCarnets(): void {
    this.medicalService.getAllCarnets().subscribe({
      next: (data) => {
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
  

  
  
  

  // Supprimer un carnet
  
  deleteCarnet(id: number): void {
    if (!id) {
      console.error('ID du carnet manquant');
      return;
    }
    
    this.medicalService.deleteCarnet(id).subscribe({
      next: () => {
        // Supprimer le carnet localement
        this.carnets = this.carnets.filter(carnet => carnet.id !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du carnet', err);
      }
    });
  }
  
  

  // Navigation vers le formulaire d'ajout d'un carnet
  navigateToMedicalNotebookForm(): void {
    this.router.navigate(['/medicalnotebookform']);
  }
  
  /*

  Carnets: any[] = [];
  records: any[] = [];


  ngOnInit(): void {
    
  }

  

  navigateToMedicalNotebookForm(): void {
    this.router.navigate(['/medicalnotebookform']);
  }*/
}
