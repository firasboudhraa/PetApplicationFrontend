import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isPetsSubmenuOpen: boolean = false; // Submenu is collapsed by default

  togglePetsSubmenu() {
    this.isPetsSubmenuOpen = !this.isPetsSubmenuOpen; // Toggle the state
    console.log('Pets submenu state:', this.isPetsSubmenuOpen); // Debugging
  }
}
