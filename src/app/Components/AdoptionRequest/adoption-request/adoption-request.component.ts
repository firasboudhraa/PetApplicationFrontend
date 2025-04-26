import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Pet } from 'src/app/models/pet';
import { AdoptionRequestService } from 'src/app/Services/adoption-request.service';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adoption-request',
  templateUrl: './adoption-request.component.html',
  styleUrls: ['./adoption-request.component.css']
})
export class AdoptionRequestComponent implements OnInit {
  adoptionForm!: FormGroup;
  map: any;
  marker: any;
  isMapReady = false;
  location: string = '';
  requesterUserId!:number ;
  petId!:number ;
  adoptedPet!:Pet ;
  minDate: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private mapsLoader: GoogleMapsLoaderService,
    private petdataService: PetdataServiceService ,
    private adoptionRequestService: AdoptionRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //min date start from tomorow
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    this.minDate = currentDate.toISOString().split('T')[0];
    this.adoptionForm = this.fb.group({
      location: [''],
      time: ['',Validators.required],
      date: ['',Validators.required],
      message: [''],
      adoptedPet: [this.adoptedPet],
      requesterUserId: [this.requesterUserId]
      
    });

    this.requesterUserId = Number(this.route.snapshot.queryParamMap.get('userId'));
    this.petId = Number(this.route.snapshot.queryParamMap.get('petId'));
    this.petdataService.getPetById(this.petId).subscribe((data) => {
      this.adoptedPet = data;
      this.adoptionForm.patchValue({
        adoptedPet: this.adoptedPet,
        requesterUserId: this.requesterUserId,
      });
      this.mapsLoader.load().then(() => {
        this.initMap();
      }).catch(err => {
        console.error('Google Maps failed to load', err);
      });
    });


  }
  submitAdoptionRequest() {
    if (this.adoptionForm.valid) { 
      console.log(this.adoptionForm.value);
      this.adoptionRequestService.saveAdoptionRequest(this.adoptionForm.value).subscribe(
        (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Adoption request sent successfully!',
              showConfirmButton: true,
              confirmButtonText: 'OK',  
              confirmButtonColor: '#3085d6'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/adoptionRequestDashboard'], {
                });
              }
              
            });
        });
    }
  }
  

  initMap() {
    const mapElement = document.getElementById('map');
    const inputElement = document.getElementById('autocomplete') as HTMLInputElement;
  
    if (!mapElement || !inputElement) return;
  
    let defaultCenter = { lat: 36.8065, lng: 10.1815 }; // default center (if pet location is not available)

    // If pet location exists, use it to set the map's center
    if (this.adoptedPet.location) {
      const petLocation = this.adoptedPet.location.split(','); // Assuming location format is "lat, lng"
      const petLat = parseFloat(petLocation[0].trim());
      const petLng = parseFloat(petLocation[1].trim());
      defaultCenter = { lat: petLat, lng: petLng };
    }
  
    const map = new google.maps.Map(mapElement, {
      center: defaultCenter, // Set center to pet location if available, otherwise default
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
        position: place.geometry.location,
        label: 'Selected Location', // Custom label for selected location
      });
  
      const latlng = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
      this.adoptionForm.controls['location'].setValue(latlng);
    });
  
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
  
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const latlng = `${lat}, ${lng}`;
  
      if (marker) marker.setMap(null);
      marker = new google.maps.Marker({
        map,
        position: event.latLng,
        label: 'Selected Location', // Custom label for clicked location
      });
  
      this.adoptionForm.controls['location'].setValue(latlng);
    });
  
    // Pin pet's location if pet.location is available
    if (this.adoptedPet.location) {
      const petLocation = this.adoptedPet.location.split(','); // Assuming location format is "lat, lng"
      const petLat = parseFloat(petLocation[0].trim());
      const petLng = parseFloat(petLocation[1].trim());
  
      const petPosition = new google.maps.LatLng(petLat, petLng);
  
      // Place the pet's marker
      new google.maps.Marker({
        map,
        position: petPosition,
        label: 'Actual Pet Location', // Custom label for pet's location
      });
  
      map.setCenter(petPosition); // Center map on pet's location
      map.setZoom(14); // Optional: Adjust zoom level for pet's location
    }
  }
  
  
  
}
