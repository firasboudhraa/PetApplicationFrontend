import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';
import { PetdataServiceService } from 'src/app/Services/petdata-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-pet-modal',
  templateUrl: './add-pet-modal.component.html',
  styleUrls: ['./add-pet-modal.component.css']
})
export class AddPetModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() petAdded = new EventEmitter<void>(); 
  @ViewChild('modalBody') modalBody!: ElementRef;


  closeModal() {
    this.close.emit();
  }

  constructor(private petDataService: PetdataServiceService , private mapsLoader :GoogleMapsLoaderService) {}

  petForm!: FormGroup;
  selectedImage: File | null = null;
  imageError: string | null = null;

  ngOnInit() {
    this.petForm = new FormGroup({
      name: new FormControl('', Validators.required),
      imagePath: new FormControl('', Validators.required),
      species: new FormControl('', Validators.required),
      age: new FormControl('', [Validators.required, Validators.min(0)]),
      color: new FormControl('', Validators.required),
      sex: new FormControl('', Validators.required),
      description: new FormControl('', ), 
      location: new FormControl('', ), 
      forAdoption: new FormControl(false, )
    });
  }
  ngOnChanges() {
    this.mapsLoader.load().then(() => {
      this.initMap();
    }).catch(err => {
      console.error('Google Maps failed to load', err);
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

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.petDataService.addPet(formData).subscribe(
        (response) => {
          console.log('Pet added successfully:', response);
          this.petAdded.emit();
          this.closeModal();
          this.petForm.reset(); // Reset the form after successful submission
          Swal.fire({
            icon: 'success',
            title: 'Pet Added',
            text: '✅ Your Pet was Added successfully!',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
          
        },
        (error) => {
          console.error('Error adding pet:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to Add your pet.',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.imageError = 'Only image files are allowed.';
        this.selectedImage = null;
        this.petForm.get('imagePath')?.setValue(null); 
      } else {
        this.imageError = null;
        this.selectedImage = file;
        this.petForm.get('imagePath')?.setValue(file); 
      }
    }
  }
}
