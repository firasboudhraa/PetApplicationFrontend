import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PetApplication';
  showLayout = true;
  showChatPopup = true; // Ajouté ici

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        const url = event.urlAfterRedirects;

        // Contrôle des éléments de layout
        this.showLayout = !(
          url.startsWith('/dashboard') ||
          url.startsWith('/service-dashboard') ||
          url.startsWith('/add-service-dashboard') ||
          url.startsWith('/appointments-dashboard') ||
          url.startsWith('/stats-dashboard') ||
          url.startsWith('/login') ||
          url.startsWith('/register') ||
          url.startsWith('/update-service-dashboard') 
        );

        // Contrôle de l'affichage du chat
        this.showChatPopup = !(
          url.startsWith('/produit') || 
          url.startsWith('/blog') ||
          url.startsWith('/gemini') ||
          url.startsWith('/register') ||
          url.startsWith('/login')
        );
      });
  }
}
