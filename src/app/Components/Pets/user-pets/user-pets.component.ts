import { Component, Renderer2 } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import { PetsSpeciesService } from 'src/app/Services/shared/pets-species.service';

@Component({
  selector: 'app-user-pets',
  templateUrl: './user-pets.component.html',
  styleUrls: ['./user-pets.component.css']
})
export class UserPetsComponent {
  pets: Pet[] = []; // Current page pets
  filteredPets: Pet[] = [];
  selectedSpecies: string = '';
  allPets: Pet[] = []; 
  petSpecies : any[] = [] ;

  selectedPet!: Pet;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;

  showModal: boolean = false;
  showDetail: boolean = false;
  showEditModal: boolean = false;
  userId:number = 1 ; 
  constructor(private petDataService: PetdataServiceService ,private renderer: Renderer2 , private ps : PetsSpeciesService ) {}

  openModal() {
    this.showModal = true;
    this.renderer.addClass(document.querySelector('.page-container'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-footer'), 'blur-effect');
  }
  
  closeModal() {
    this.showModal = false;
    this.renderer.removeClass(document.querySelector('.page-container'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-footer'), 'blur-effect');
  }
  openDetailModal(pet: Pet) {
    this.selectedPet = pet;
    this.showDetail = true;
    this.renderer.addClass(document.querySelector('.page-container'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-footer'), 'blur-effect');
    
  }
  closeDetailModal() {
    this.showDetail = false;
    this.renderer.removeClass(document.querySelector('.page-container'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-footer'), 'blur-effect');
    console.log(this.selectedPet)
  }
  openEditModal() {
    this.showEditModal = true;
    this.renderer.addClass(document.querySelector('.page-container'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-footer'), 'blur-effect');
    
  }
  closeEditModal() {
    this.showEditModal = false;
    this.renderer.removeClass(document.querySelector('.page-container'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-footer'), 'blur-effect');
  }
  filterPets(): void {
    if (this.selectedSpecies != '') {
      this.filteredPets = this.allPets.filter((pet) =>
        pet.species.toLowerCase() === this.selectedSpecies.toLowerCase()
      );
    } else {
      this.filteredPets = [...this.allPets];
    }
    this.totalItems = this.filteredPets.length;
    this.currentPage = 1;
    this.loadPets()
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  ngOnInit(): void {
    this.petDataService.getPetsByOwnerId(this.userId).subscribe((data) => {
      this.allPets = data;
      this.totalItems = this.allPets.length;
      this.filterPets();
      
    }); 
    this.petSpecies = this.ps.speciesOption ;
  }

  loadPets(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    this.pets = this.filteredPets.slice(startIndex, endIndex);
  }
  loadPetsAfterChange(): void {

    this.petDataService.getPets().subscribe((data) => {
      this.allPets = data;
      this.totalItems = this.allPets.length;
      this.filterPets();
    }); 

  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPets();
    }
  }

  getIndexArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i); 
  }

  onPetAdded() {
    this.loadPetsAfterChange(); 
  }
  
  applyFilter(species: string): void {
    this.selectedSpecies = species; // Update the selected species
    this.filterPets(); // Apply the filter
  }
}
