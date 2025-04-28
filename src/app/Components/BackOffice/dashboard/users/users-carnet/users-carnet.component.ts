import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalService } from 'src/app/Services/medical.service';
import { forkJoin, map, catchError, of } from 'rxjs';
import { Pet } from 'src/app/models/pet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { FullCarnetResponse, Record } from '../../../../../models/records';


@Component({
  selector: 'app-users-carnet',
  templateUrl: './users-carnet.component.html',
  styleUrls: ['./users-carnet.component.css']
})
export class UsersCarnetComponent {


  editCarnet(carnet: any) {
    if (carnet && carnet.id) {
      console.log('carnet ', carnet.id);
    } else {
      console.error('Invalid carnet for editing:', carnet);
    }
  }


  carnets: any[] = [];
  searchText: string = '';
  id!: number;
  records: any[] = [];
  showForm: boolean = false;
  carnetForm!: FormGroup;

  Statcarnets: FullCarnetResponse[] = [];
    selectedCarnetId: number | null = null;
    lineChartData: ChartConfiguration<'line'>['data'] | undefined;
    lineChartOptions: ChartConfiguration<'line'>['options'] = {
      responsive: true
    };

  pets: Pet[] = [
    { id: 1, name: 'Rex', imagePath: 'assets/dog1.jpg', species: 'Chien', age: 3, color: 'Marron', sex: 'Mâle', ownerId: 101, description: 'Chien affectueux et joueur.', forAdoption: false, location: 'Paris' ,adoptionRequests: []},
    { id: 2, name: 'Misty', imagePath: 'assets/cat1.jpg', species: 'Chat', age: 2, color: 'Gris', sex: 'Femelle', ownerId: 102, description: 'Chat calme et doux.', forAdoption: true, location: 'Lyon' ,adoptionRequests: []},
    { id: 3, name: 'Charlie', imagePath: 'assets/dog2.jpg', species: 'Chien', age: 5, color: 'Noir', sex: 'Mâle', ownerId: 103, description: 'Chien énergique et intelligent.', forAdoption: false, location: 'Marseille' ,adoptionRequests: []},
    { id: 4, name: 'miomioe', imagePath: 'assets/dog2.jpg', species: 'chatton', age: 5, color: 'blanc', sex: 'Mâle', ownerId: 106, description: 'Chien énergique et intelligent.', forAdoption: false, location: 'Marseille' ,adoptionRequests: []},

  ];  

  constructor(
    private router: Router,
    private medicalService: MedicalService,
    private act: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  onCarnetSelected(): void {
    if (this.selectedCarnetId === null) return;

    this.medicalService.getMedicalRecordsByCarnetId(this.selectedCarnetId).subscribe((response: FullCarnetResponse) => {
      const poidsData = response.medicalRecords
        .filter((record: Record) =>
          record.poids > 0 &&
          record.dateTime &&
          !isNaN(new Date(record.dateTime).getTime())
        )
        .map((record: Record) => ({
          date: new Date(record.dateTime!).toLocaleDateString(),
          poids: record.poids
        }));

      if (poidsData.length > 0) {
        this.lineChartData = {
          labels: poidsData.map(p => p.date),
          datasets: [
            {
              label: 'Poids (kg)',
              data: poidsData.map(p => p.poids),
              borderColor: '#4e73df',
              backgroundColor: 'rgba(78, 115, 223, 0.2)',
              tension: 0.4
            }
          ]
        };
      } else {
        this.lineChartData = undefined;
      }
    });
  }


  

  ngOnInit(): void {
    this.id = this.act.snapshot.params['id'];
    this.loadCarnets();
    this.initForm();
  }

  initForm(): void {
    this.carnetForm = this.fb.group({
      pet_id: ['', Validators.required]
    });
  }

  loadCarnets(): void {
    this.medicalService.getAllCarnets().subscribe({
      next: (data) => {
        const carnetRequests = data.map(carnet =>
          this.medicalService.getMedicalRecordsByCarnetId(carnet.id).pipe(
            map(records => {
              carnet.medicalRecords = Array.isArray(records) ? records : [];
              return carnet;
            }),
            catchError(err => {
              console.error(`Erreur records carnet ${carnet.id}:`, err);
              carnet.medicalRecords = [];
              return of(carnet);
            })
          )
        );

        forkJoin(carnetRequests).subscribe({
          next: (carnetsWithRecords) => {
            this.carnets = carnetsWithRecords;
          },
          error: (err) => {
            console.error('Erreur chargement carnets avec forkJoin:', err);
          }
        });
      },
      error: (err) => {
        console.error('Erreur chargement carnets:', err);
      }
    });
  }

  get filteredCarnets(): any[] {
    if (!this.searchText) return this.carnets;
    const search = this.searchText.toLowerCase();
    return this.carnets.filter(c =>
      c.name?.toLowerCase().includes(search)
    );
  }

  deleteCarnet(carnet: any): void {
    if (!carnet?.id) {
      console.error('ID carnet manquant.');
      return;
    }

    this.medicalService.deleteCarnet(carnet.id).subscribe({
      next: () => {
        this.loadCarnets();
      },
      error: (err) => {
        console.error(`Erreur suppression carnet ${carnet.id}`, err);
      }
    });
  }

  saveCarnet(): void {
    if (this.carnetForm.valid) {
      const selectedPetId = +this.carnetForm.value.pet_id;
      const selectedPet = this.pets.find(pet => pet.id === selectedPetId);

      if (!selectedPet) {
        console.error('Animal non trouvé pour l\'ID:', selectedPetId);
        return;
      }

      const carnetData = { pet_id: selectedPetId, name: selectedPet.name };

      this.medicalService.createCarnet(carnetData).subscribe({
        next: (response) => {
          console.log('Carnet créé avec succès:', response);
          this.showForm = false;
          this.loadCarnets();
        },
        error: (error) => {
          console.error('Erreur lors de la création du carnet:', error);
        }
      });
    }
  }


  editModeId: number | null = null;
  editedName: string = '';


}
