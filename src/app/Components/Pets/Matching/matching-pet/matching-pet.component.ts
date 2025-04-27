import { Component, Renderer2 } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import { PetsSpeciesService } from 'src/app/Services/shared/pets-species.service';
import { MatchingService } from '../matching.service';
import { Match } from '../matchModel';
import { UserService } from 'src/app/Services/user.service';
@Component({
  selector: 'app-matching-pet',
  templateUrl: './matching-pet.component.html',
  styleUrls: ['./matching-pet.component.css']
})

export class MatchingPetComponent {
 pets: Pet[] = []; 
 filteredPets: Pet[] = [];
 selectedSpecies: string = '';

  allPets: Pet[] = []; 
  selectedPet!: Pet;
  // matching data
  
  matches: { [petId: string]: { 
    score: number; 
    reasons: string[]; 
    consideration: string 
  } } = {};
  itemsPerPageOptions: number[] = [3, 5, 10, 15, 20]; 
  itemsPerPage: number = this.itemsPerPageOptions[0];
  currentPage: number = 1;
  totalItems: number = 0;

  showModal: boolean = false;
  showDetail: boolean = false;
  showEditModal: boolean = false;
  isUserPet: boolean = false;
  userId:number = 0 ; 
  constructor(
    private petDataService: PetdataServiceService, 
    private ps: PetsSpeciesService,
    private renderer: Renderer2,
    private matchingService: MatchingService,
    private userService: UserService  
  ) {}


  openModal() {
    this.showModal = true;
    this.renderer.addClass(document.querySelector('.ftco-section'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-footer'), 'blur-effect');
  }
  
  closeModal() {
    this.showModal = false;
    this.renderer.removeClass(document.querySelector('.ftco-section'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-footer'), 'blur-effect');
  }
  openDetailModal(pet: Pet) {
    this.selectedPet = pet;
    this.showDetail = true;
    this.userId = this.userService.getCurrentUserId();
    this.renderer.addClass(document.querySelector('.ftco-section'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-footer'), 'blur-effect');
    
  }
  closeDetailModal() {
    this.showDetail = false;
    this.renderer.removeClass(document.querySelector('.ftco-section'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-footer'), 'blur-effect');
    console.log(this.selectedPet)
  }
  openEditModal() {
    this.showEditModal = true;
    this.renderer.addClass(document.querySelector('.ftco-section'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.addClass(document.querySelector('app-footer'), 'blur-effect');
    
  }
  closeEditModal() {
    this.showEditModal = false;
    this.renderer.removeClass(document.querySelector('.ftco-section'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-navbar'), 'blur-effect');
    this.renderer.removeClass(document.querySelector('app-footer'), 'blur-effect');
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  speciesSearchTerm: string = '';
  displayedSpecies: { label: string; value: string }[] = [];

  petSpecies : any[] = [] ;

  showAllSpecies: boolean = false;
  updateFilteredSpecies() {
    const term = this.speciesSearchTerm.toLowerCase();
  
    if (term) {
      this.displayedSpecies = this.petSpecies.filter(option =>
        option.label.toLowerCase().includes(term)
      );
    } else if (this.showAllSpecies) {
      this.displayedSpecies = [...this.petSpecies];
    } else {
      this.displayedSpecies = this.petSpecies.slice(0, 3);
    }
  }
  showAllSpeciesOptions() {
    this.showAllSpecies = true;
    this.updateFilteredSpecies();
  }
  searchKeyword: string = '';
  selectedGender: string = '';
  adoptionStatus: string = ''; 

  filterPets(): void {
  let petsToFilter = [...this.allPets];

  // Species filter
  if (this.selectedSpecies !== '') {
    petsToFilter = petsToFilter.filter(p => p.species.toLowerCase() === this.selectedSpecies.toLowerCase());
  }

  // Gender filter
  if (this.selectedGender !== '') {
    petsToFilter = petsToFilter.filter(p => p.sex.toLowerCase() === this.selectedGender.toLowerCase());
  }

  // isForAdoption filter
  if (this.adoptionStatus !== '') {
    const isForAdoption = this.adoptionStatus === 'true';
    petsToFilter = petsToFilter.filter(p => p.forAdoption === isForAdoption);
  }

  // Keyword search
  if (this.searchKeyword.trim() !== '') {
    const keyword = this.searchKeyword.toLowerCase();
    petsToFilter = petsToFilter.filter(pet =>
      Object.values(pet).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(keyword)
      )
    );
  }

  this.filteredPets = petsToFilter;
  this.totalItems = this.filteredPets.length;
  this.currentPage = 1;
  this.loadPets();
}
setSpeciesFilter(species: string) {
  this.selectedSpecies = species;
  this.filterPets();
}

setGenderFilter(gender: string) {
  this.selectedGender = gender;
  this.filterPets();
}

setAdoptionFilter(status: string) {
  this.adoptionStatus = status;
  this.filterPets();
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
  changeItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; 
    this.loadPets();
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

  loadMatches() {
    this.matchingService.getMatchesForUser(this.userId).subscribe({
      next: (response) => {
        response.matches.forEach(match => {
          this.matches[match.id] = {
            score: match.match_score, 
            reasons: match.reasons,
            consideration: match.consideration
          };
        });
        
        // Enhance pets with match data
        this.allPets = this.allPets.map(pet => {
          const match = this.matches[pet.id.toString()];
          return match ? { 
            ...pet, 
            matchData: {
              score: match.score,
              reasons: match.reasons,
              consideration: match.consideration
            } 
          } : pet;
        });
        
        this.filterPets();
      },
      error: (err) => {
        console.error('Error loading matches:', err);
      }
    });
  }
    ngOnInit(): void {
    this.adoptionStatus = 'true'; 
    this.petDataService.getPets().subscribe((data) => {
      this.allPets = data;
      this.totalItems = this.allPets.length;
      this.filterPets();
      this.loadMatches(); 
    }); 
    this.petSpecies = this.ps.speciesOption;
    this.updateFilteredSpecies(); 

}
}
