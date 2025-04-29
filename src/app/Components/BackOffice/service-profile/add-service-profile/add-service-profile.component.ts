import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import  { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';
import  { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-service-profile',
  templateUrl: './add-service-profile.component.html',
  styleUrls: ['./add-service-profile.component.css']
})
export class AddServiceProfileComponent {

  serviceForm!: FormGroup;
    loading = false;
    map: any;
    marker: any;
  
    constructor(
      private ps: PetServiceService,
      private router: Router,
      private mapsLoader: GoogleMapsLoaderService,
      private authService:AuthService
    ) {
      this.serviceForm = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        price: new FormControl(null, [Validators.required, Validators.min(1)]),
        durationInMinutes: new FormControl(null, [Validators.required, Validators.min(10)]),
        address: new FormControl('', Validators.required),
        startDate: new FormControl('', Validators.required),
        endDate: new FormControl('', Validators.required)
      }, { validators: this.dateRangeValidator });
    }
  
    ngAfterViewInit() {
      this.mapsLoader.load().then(() => this.initMap());
    }
  
    initMap() {
      const mapElement = document.getElementById('map');
      const inputElement = document.getElementById('autocomplete') as HTMLInputElement;
  
      if (!mapElement || !inputElement) return;
  
      const defaultCenter = { lat: 36.8065, lng: 10.1815 }; 
  
      const map = new google.maps.Map(mapElement, {
        center: defaultCenter,
        zoom: 12
      });
  
      let marker: google.maps.Marker | null = null;
  
      const autocomplete = new google.maps.places.Autocomplete(inputElement);
      autocomplete.bindTo('bounds', map);
  
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
  
        map.setCenter(place.geometry.location);
        map.setZoom(14);
  
        if (marker) marker.setMap(null);
        marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
          label: 'Service Location',
        });
  
        this.serviceForm.controls['address'].setValue(place.formatted_address || inputElement.value);
      });
  
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return;
  
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
  
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address;
            if (marker) marker.setMap(null);
            marker = new google.maps.Marker({
              map,
              position: { lat, lng },
              label: 'Selected',
            });
            this.serviceForm.controls['address'].setValue(address);
            inputElement.value = address;
          }
        });
      });
    }
  
    dateRangeValidator(group: AbstractControl): ValidationErrors | null {
      const start = new Date(group.get('startDate')?.value);
      const end = new Date(group.get('endDate')?.value);
      if (start && end && end <= start) {
        return { dateRangeInvalid: true };
      }
      return null;
    }
  
    onSubmit() {
      if (this.serviceForm.invalid) {
        this.serviceForm.markAllAsTouched();
        return;
      }
      const userId = this.authService.getDecodedToken()?.userId ?? 0;
  
      this.loading = true;
      const formData = { ...this.serviceForm.value, providerId: userId };
  
      this.ps.addService(formData).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Service Added',
            text: 'The service has been successfully created!',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.serviceForm.reset();
            this.router.navigate(['/service-dashboard']);
          });
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'Something went wrong. Please try again later.',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
}
