import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Pet } from 'src/app/models/pet';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';

@Component({
  selector: 'app-pet-stats',
  templateUrl: './pet-stats.component.html',
  styleUrls: ['./pet-stats.component.css']
})
export class PetStatsComponent {
  constructor(private petService : PetdataServiceService){}
  pets: Pet[] = [];
  showPetStats = true;
  totalForAdoption = 10 ;
  speciesChartLabels: string[] = [];
  animatedAdoptionCount: number = 0;


  speciesChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8'],
      }
    ]
  };
  
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        label: 'Pets count',
        data: [],
        backgroundColor: '#42A5F5'
      }
    ]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };
  
  ngOnInit():void{
    this.petService.getPets().subscribe(data => {
      this.pets = data ;
      this.totalForAdoption = this.pets.filter(pet => pet.forAdoption).length;
      this.animateAdoptionCount();
      this.prepareSpeciesStats();
      console.log(this.pets) ;
    })
  }
  animateAdoptionCount() {
    let count = 0;
    const target = this.totalForAdoption;
    const duration = 3000; // 1 second
    const stepTime = Math.max(Math.floor(duration / target), 2000); // minimum 20ms per step
  
    const interval = setInterval(() => {
      count++;
      this.animatedAdoptionCount = count;
      if (count >= target) {
        clearInterval(interval);
      }
    }, stepTime);}


  prepareSpeciesStats() {
    const countMap: Record<string, number> = {};
  
    for (const pet of this.pets) {
      countMap[pet.species] = (countMap[pet.species] || 0) + 1;
    }
  
    const labels = Object.keys(countMap);
    const data = Object.values(countMap);
  
    this.speciesChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8']
        }
      ]
    };
  
    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Pets count',
          data,
          backgroundColor: '#42A5F5'
        }
      ]
    };
  }
  

  downloadPetStatsPdf() {
    const DATA: any = document.getElementById('petStatistics');

    html2canvas(DATA).then(canvas => {
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      const width = PDF.internal.pageSize.getWidth();
      const height = canvas.height * width / canvas.width;

      PDF.addImage(FILEURI, 'PNG', 0, 10, width, height);
      PDF.save('pet-statistics.pdf');
    });
  }
}
