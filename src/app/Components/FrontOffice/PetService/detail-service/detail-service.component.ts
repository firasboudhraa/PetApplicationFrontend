import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-service',
  templateUrl: './detail-service.component.html',
  styleUrls: ['./detail-service.component.css']
})
export class DetailServiceComponent {
  id!: number;
  service!: any;
  availableSlots: string[] = [];

  
  constructor(private ps: PetServiceService, private Act: ActivatedRoute , private router: Router) { }

  ngOnInit(): void {
    this.id = this.Act.snapshot.params['id'];    
    this.ps.getServiceById(this.id).subscribe(
      (data) => {
        this.service = data;
        this.getAvailableSlots(); 
      }
    );
  }

  getAvailableSlots(): void {
    this.ps.getAvailableSlots(this.id).subscribe(
      (data) => {
        this.availableSlots = data;
        console.log(this.availableSlots);
      }
    );
  }
  bookAppointment(serviceId : number) {
    const user = localStorage.getItem('user');

    if (user) {
      this.router.navigate(['/appointment', serviceId]);
    } else {
      Swal.fire({
        title: '🔒 Access Restricted!',
        html: `
          <div style="font-size: 16px; font-weight: 500; color: #fff;">
            You must be logged in to access this page.
          </div>
          <br>
        `,
        icon: 'warning',
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
  }

  deleteService(id :number){
    this.ps.deleteService(id).subscribe(
      ()=> this.ngOnInit()
    )
  }
    
  

}
