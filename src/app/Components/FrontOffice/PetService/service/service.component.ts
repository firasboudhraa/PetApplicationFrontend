import { Router } from '@angular/router';
import { Component } from '@angular/core';
import  { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  services : any[] = [];
  constructor( private ps:PetServiceService , private router:Router) { }

  ngOnInit(): void {
    this.ps.getServices().subscribe(
      (data) =>{ 
        this.services = data 
      }
    );
  }

  checkUserBeforeNavigate() {
    const userString = localStorage.getItem('user');
    
    if (!userString) {
      this.showAccessDeniedAlert("You must be logged in to access this page.");
      return;
    }

    try {
      const user = JSON.parse(userString);
      const hasServiceProviderRole = user.roles.some((role: { name: string }) => role.name === 'SERVICE_PROVIDER');

      if (hasServiceProviderRole) {
        this.router.navigate(['/add-service']);
      } else {
        this.showAccessDeniedAlert("You must be a SERVICE PROVIDER to access this page.");
      }
    } catch (error) {
      this.showAccessDeniedAlert("Invalid user data. Please log in again.");
    }
  }

  showAccessDeniedAlert(message: string) {
    Swal.fire({
      title: '🔒 Access Denied!',
      html: `
        <div style="font-size: 16px; font-weight: 500; color: #fff;">
          ${message}
        </div>
        <br>
      `,
      icon: 'error',
      position: 'center',
      background: 'linear-gradient(135deg, #00c853, #1b5e20)',  
      color: '#ffffff',
      confirmButtonText: '🔑 Login Now',
      showCancelButton: true,
      cancelButtonText: '❌ Maybe Later',
      customClass: {
        popup: 'swal2-border-radius',
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button'
      },
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__zoomIn'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
  carouselOptions = {
    loop: true,
    margin: 20,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    smartSpeed: 1000,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    }
  };
  
  
  
}
