import { Component } from '@angular/core';
import { PetServiceService } from 'src/app/Services/pet-service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
services: any[] = [];
  currentPage = 1;
  pageSize = 3;
  totalPages = 0;
  constructor(private ps: PetServiceService) {}

  ngOnInit(): void {
    this.ps.getServices().subscribe(data => {
      this.services = data;
      this.totalPages = Math.ceil(this.services.length / this.pageSize);
    });
  }


  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

}
