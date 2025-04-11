import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalService } from 'src/app/Services/medical.service';
import { forkJoin, map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  carnets: any[] = [];
  searchText: string = ''; // Pour la recherche
  id!: number;

  constructor(
    private router: Router,
    private medicalService: MedicalService,
    private act: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.act.snapshot.params['id'];
    this.loadCarnets();
  }

  // Charge tous les carnets avec leurs records
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

  // Getter pour le filtre
  get filteredCarnets(): any[] {
    if (!this.searchText) return this.carnets;
    const search = this.searchText.toLowerCase();
    return this.carnets.filter(c =>
      c.name?.toLowerCase().includes(search)
    );
  }

  // Suppression carnet
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

  navigateToMedicalNotebookForm(): void {
    this.router.navigate(['/add-carnet']); // Ajuste la route selon ton app
  }
}
