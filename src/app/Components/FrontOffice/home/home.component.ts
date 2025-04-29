import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stats = [
    { label: 'Registered Users', value: 0, target: 2450 },
    { label: 'Available Pets', value: 0, target: 320 },
    { label: 'Certified Vets', value: 0, target: 75 },
    { label: 'Community Interactions', value: 0, target: 1500 }
  ];

  animated = false;

  ngOnInit(): void {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const statsSection = document.getElementById('statistics');
    if (statsSection && !this.animated) {
      const position = statsSection.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;

      if (position < screenHeight) {
        this.startAnimation();
        this.animated = true;
      }
    }
  }

  startAnimation(): void {
    this.stats.forEach((stat) => {
      const interval = setInterval(() => {
        if (stat.value < stat.target) {
          stat.value += Math.ceil(stat.target / 100);
        } else {
          stat.value = stat.target;
          clearInterval(interval);
        }
      }, 30);
    });
  }
}
