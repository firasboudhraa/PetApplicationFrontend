import { Component, AfterViewInit } from '@angular/core';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import { ContactService } from 'src/app/Services/contact.service';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service'; // Import AuthService
import { UserService } from 'src/app/Components/FrontOffice/user/service_user/user.service';
import { User } from '../user/models/user_model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements AfterViewInit {
  map: any;

  isLoggedIn = false;

  constructor(
    private mapsLoader: GoogleMapsLoaderService,
    private contactService: ContactService,
    public userService: UserService,
    public authService: AuthService, 
    private router: Router  // Add Router for navigation
    // Add AuthService here

  ) {}

  ngOnInit(): void {
    const decodedToken = this.authService.getDecodedToken();
  
    if (decodedToken && decodedToken.userId) {
      this.isLoggedIn = true;
      
      // Fetch full user details to get the email
      this.userService.getUserById(decodedToken.userId).subscribe(user => {
        this.contactForm.email = user.email;
      });
    } else {
      this.isLoggedIn = false;
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/contact' }
    });
  }
  
  
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  successMessage = '';
  errorMessage = '';

 

  ngAfterViewInit() {
    this.mapsLoader.load().then(() => {
      if (typeof google !== 'undefined' && google.maps) {
        this.initMap(google.maps);
      } else {
        console.error("Google Maps API failed to load.");
      }
    }).catch(err => {
      console.error("Google Maps failed to load: ", err);
    });
  }

  initMap(googleMaps: any) {
    const mapElement = document.getElementById('map');
    const defaultCenter = { lat: 36.79976499765684, lng: 10.1815 };
    if (!mapElement) return;

    this.map = new googleMaps.Map(mapElement, {
      center: defaultCenter,
      zoom: 14,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    new googleMaps.Marker({
      position: defaultCenter,
      map: this.map,
      title: 'Our Location',
      animation: googleMaps.Animation.DROP
    });
  }

  onSubmit() {
    // Show SweetAlert immediately
    Swal.fire({
      icon: 'success',
      title: 'Message Sent',
      text: 'Your message has been sent successfully!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });
  
    // Proceed to send the mail in the background
    this.contactService.sendContactForm(this.contactForm).subscribe({
      next: () => {
        // Reset only name, subject, and message
        this.contactForm.name = '';
        this.contactForm.subject = '';
        this.contactForm.message = '';
        // Keep email as-is
        this.successMessage = '';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(err);
        this.successMessage = '';
        this.errorMessage = "Failed to send message. Please try again.";
      }
    });
  }
  
  
}
