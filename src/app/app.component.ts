import { Component } from '@angular/core';
import  { Router, NavigationEnd , Event  } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PetApplication';
  showLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        this.showLayout = !(
          event.urlAfterRedirects.startsWith('/dashboard') || 
          event.urlAfterRedirects.startsWith('/service-dashboard') ||
           event.urlAfterRedirects.startsWith('/add-service-dashboard') ||
           event.urlAfterRedirects.startsWith('/appointments-dashboard') ||
           event.urlAfterRedirects.startsWith('/stats-dashboard')
        );
      });
  }
}
