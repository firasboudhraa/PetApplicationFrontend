import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-about-component',
  templateUrl: './about-component.component.html',
  styleUrls: ['./about-component.component.css']
})
export class AboutComponentComponent implements OnInit{
  isVideoPlaying = false;
  videoSrc = 'assets/video/petCaring.mp4';

  playVideo() {
    this.isVideoPlaying = true;
  }

  closeVideo() {
    this.isVideoPlaying = false;
  }
  public customerCount = 0;
  public professionalsCount = 0;
  public productsCount = 0;
  public petsCount = 0;
  ngOnInit(): void {
    this.incrementCount();
  }

  incrementCount(): void {
    const customerTarget = 250;
    const professionalsTarget = 850;
    const productsTarget = 420;
    const petsTarget = 650;

    let interval = setInterval(() => {
      if (this.customerCount < customerTarget) {
        this.customerCount++;
      }
      if (this.professionalsCount < professionalsTarget) {
        this.professionalsCount++;
      }
      if (this.productsCount < productsTarget) {
        this.productsCount++;
      }
      if (this.petsCount < petsTarget) {
        this.petsCount++;
      }

      if (this.customerCount === customerTarget && this.professionalsCount === professionalsTarget &&
        this.productsCount === productsTarget && this.petsCount === petsTarget) {
        clearInterval(interval);
      }
    }, 10); // Ajuste la vitesse de l'incrémentation ici
  }

}