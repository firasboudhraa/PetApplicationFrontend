import { Component, OnInit, Renderer2 } from '@angular/core';
import { Pet } from 'src/app/models/pet';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';

@Component({
  selector: 'app-show-pets',
  templateUrl: './show-pets.component.html',
  styleUrls: ['./show-pets.component.css']
})
export class ShowPetsComponent implements OnInit {
  pets: Pet[] = []; // Current page pets

  allPets: Pet[] = []; 
  selectedPet!: Pet;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;

  showModal: boolean = false;
  showDetail: boolean = false;
  showEditModal: boolean = false;
  constructor(private petDataService: PetdataServiceService ,private renderer: Renderer2 ) {}

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

  ngOnInit(): void {
    this.petDataService.getPets().subscribe((data) => {
      this.allPets = data;
      this.totalItems = this.allPets.length;
      this.loadPets();
    }); 
  }

  loadPets(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    this.pets = this.allPets.slice(startIndex, endIndex);
  }
  loadPetsAfterChange(): void {

    this.petDataService.getPets().subscribe((data) => {
      this.allPets = data;
      this.totalItems = this.allPets.length;
      this.loadPets();
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
  
}
