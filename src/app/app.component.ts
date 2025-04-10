import { Component } from '@angular/core';
<<<<<<< HEAD
=======
import  { Router, NavigationEnd , Event  } from '@angular/router';
import { filter } from 'rxjs/operators';
>>>>>>> origin/main

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PetApplication';
<<<<<<< HEAD
}
=======
  showLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        this.showLayout = !event.urlAfterRedirects.startsWith('/dashboard');
      });
  }
}
>>>>>>> origin/main
