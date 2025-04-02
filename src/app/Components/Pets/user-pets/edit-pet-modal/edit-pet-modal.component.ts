import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pet } from 'src/app/models/pet';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-pet-modal',
  templateUrl: './edit-pet-modal.component.html',
  styleUrls: ['./edit-pet-modal.component.css']
})
export class EditPetModalComponent {
 @Input() isVisible: boolean = false;
 @Input() pet!: Pet;
  @Output() close = new EventEmitter<void>();
  @Output() petEdited = new EventEmitter<void>(); // New event emitter for success
    @ViewChild('modalBody') modalBody!: ElementRef;
  
  confirmationShowed: boolean = false;
  
  constructor(private petDataService: PetdataServiceService , private mapsLoader :GoogleMapsLoaderService) {}
  showConfirmButton() {
    this.confirmationShowed = true;
  }
  hideConfirmButton() {
    this.confirmationShowed = false;
  }
  closeModal() {
    this.close.emit();
    this.humanReadableLocation='';
    this.petForm.reset(); // R
  }


  petForm!: FormGroup;
  selectedImage: File | null = null;
  imageError: string | null = null;

  ngOnInit() {
    this.petForm = new FormGroup({
      name: new FormControl('', Validators.required),
      imagePath: new FormControl('', ),
      species: new FormControl('', Validators.required),
      age: new FormControl('', [Validators.required, Validators.min(0)]),
      color: new FormControl('', Validators.required),
      sex: new FormControl('', Validators.required),
      description: new FormControl('', ), 
      location: new FormControl('', ), 
      forAdoption: new FormControl(false, )
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pet'] && changes['pet'].currentValue) {
      this.petForm.patchValue({
        name: this.pet.name,
        species: this.pet.species,
        age: this.pet.age,
        color: this.pet.color,
        sex: this.pet.sex,
        location: this.pet.location,
        description: this.pet.description
      });    
    }
    
    this.mapsLoader.load().then(() => {
       this.initMap();
     }).catch(err => {
       console.error('Google Maps failed to load', err);
     });      
     console.log("entred ")
     if(this.pet.location) {
      const [latStr, lngStr] = this.pet.location.split(',').map(coord => coord.trim());
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        this.getAddressFromLatLng(lat, lng);
      } 
    }else {
      this.humanReadableLocation = 'Unknown location';
    }
  }
  humanReadableLocation: string = '';
    getAddressFromLatLng(lat: number, lng: number): void {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat, lng };
    
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          if (results && results[0]) {
            this.humanReadableLocation = results[0].formatted_address;
          } else {
            console.warn('No results found');
            this.humanReadableLocation = 'Unknown location';
          }
        } else {
          console.error('Geocoder failed due to: ' + status);
          this.humanReadableLocation = 'Geocoder failed';
        }
      });
    }
  onModalScroll() {
    const pacContainer = document.querySelector('.pac-container') as HTMLElement;
    if (pacContainer) {
      pacContainer.style.display = 'none';
    }
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
      this.petForm.controls['location'].setValue(latlng);
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
  
      this.petForm.controls['location'].setValue(latlng);
    });
    
  }

  onSubmit() {
    if (this.petForm.valid) {
      const formData = new FormData();
      formData.append('name', this.petForm.get('name')?.value);
      formData.append('species', this.petForm.get('species')?.value);
      formData.append('age', this.petForm.get('age')?.value);
      formData.append('color', this.petForm.get('color')?.value);
      formData.append('sex', this.petForm.get('sex')?.value);
      formData.append('description', this.petForm.get('description')?.value); 
      formData.append('location', this.petForm.get('location')?.value); 
      formData.append('forAdoption', this.petForm.get('forAdoption')?.value );
      formData.append('ownerId', '1');

      // Append the file if it exists

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      // Call the updatePet method with the pet ID
      this.petDataService.updatePet(this.pet.id, formData).subscribe(
        (response) => {
          console.log('Pet updated successfully:', response);
          this.petEdited.emit(); // Emit the success event
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Pet Updated',
            text: '✅ Your Pet was updated successfully!',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        },
        (error) => {
          console.error('Error updating pet:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to update your pet.',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        }
      );
      this.hideConfirmButton();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.imageError = 'Only image files are allowed.';
        this.selectedImage = null;
        this.petForm.get('imagePath')?.setValue(null); // Clear the form control
      } else {
        this.imageError = null;
        this.selectedImage = file;
        this.petForm.get('imagePath')?.setValue(file); // Set the file object in the form control
      }
    }
  }
}
