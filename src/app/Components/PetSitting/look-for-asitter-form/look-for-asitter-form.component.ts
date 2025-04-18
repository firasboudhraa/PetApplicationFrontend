import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pet } from 'src/app/models/pet';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetSittingOfferService } from 'src/app/Services/pet-sitting-offer.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-look-for-asitter-form',
  templateUrl: './look-for-asitter-form.component.html',
  styleUrls: ['./look-for-asitter-form.component.css'],
})
export class LookForASitterFormComponent implements OnInit {
  pets! :Pet[] ;
  selectedPet: number | null = null;
  selectedPetName: string | null = null;  startDate: string = '';
  petSittingForm!: FormGroup;

  endDate: string = '';
  position: string = '';
  userId: number = 1; 
  private apiUrl = 'http://localhost:8222/api/v1/pet/images';

  constructor(private fb: FormBuilder,private petDataService: PetdataServiceService,
    private mapsLoader :GoogleMapsLoaderService, private petSittingOfferService:PetSittingOfferService) {}

  ngOnInit(): void {
    this.petDataService.getPetsByOwnerId(this.userId).subscribe((data: Pet[]) => {
      this.pets = data;
      console.log(this.pets);
    });
    this.mapsLoader.load().then(() => {
      this.initMap();
    }).catch(err => {
      console.error('Google Maps failed to load', err);
    });
    this.petSittingForm = this.fb.group({
      pet: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  selectPet(pet: any): void {
    this.petSittingForm.controls['pet'].setValue(pet);
    this.selectedPet = pet.id;
    this.selectedPetName = pet.name;
  }
  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }

  initMap() {
    const mapElement = document.getElementById('map');
    const inputElement = document.getElementById('autocomplete') as HTMLInputElement;
  
    if (!mapElement || !inputElement) return;
  
    const map = new google.maps.Map(mapElement, {
      center: { lat: 36.8065, lng: 10.1815 }, // default center
      zoom: 12
    });
  
    let marker: google.maps.Marker | null = null;
  
    // Autocomplete integration
    const autocomplete = new google.maps.places.Autocomplete(inputElement);
    autocomplete.bindTo('bounds', map);
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;
  
      // Center map and place marker
      map.setCenter(place.geometry.location);
      map.setZoom(14);
  
      if (marker) marker.setMap(null);
      marker = new google.maps.Marker({
        map,
        position: place.geometry.location
      });
  
      const latlng = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
    this.petSittingForm.controls['position'].setValue(latlng);
  });
  
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
  
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const latlng = `${lat}, ${lng}`;
  
      if (marker) marker.setMap(null);
      marker = new google.maps.Marker({
        map,
        position: event.latLng
      });
  
      this.petSittingForm.controls['position'].setValue(latlng);

    });
    
  }

  submitRequest(): void {
    if (this.petSittingForm.valid) {
      this.petSittingOfferService.savePetSittingOffer(this.petSittingForm.value).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your pet sitting offer has been submitted successfully!',
            confirmButtonText: 'OK'
          }).then(() => {
            this.petSittingForm.reset();
            this.selectedPet = null;
            this.selectedPetName = null;
          }
          );  
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error submitting your request. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please fill in all required fields.',
        confirmButtonText: 'OK'
      });
    }
  }

  
}
