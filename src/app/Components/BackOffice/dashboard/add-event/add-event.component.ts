import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Event as AppEvent } from 'src/app/models/event';
import { EventService } from 'src/app/Services/event-service.service';
import Swal from 'sweetalert2';

declare var google: any;

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements AfterViewInit {
  @ViewChild('locationSearch') locationSearch!: ElementRef;
  private map: any;
  private marker: any;
  private autocomplete: any;
  private geocoder: any;

  eventForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      nameEvent: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateEvent: ['', [Validators.required]],
      location: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      goalAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngAfterViewInit(): void {
    this.geocoder = new google.maps.Geocoder();
    this.initAutocomplete();
    this.initMap();
  }

  private initAutocomplete(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.locationSearch.nativeElement,
      { types: ['geocode'] }
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (!place.geometry) return;
      
      this.updateLocationFields(
        place.formatted_address,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      this.updateMap(place.geometry.location);
    });
  }

  private initMap(): void {
    const defaultLocation = { lat: 36.8065, lng: 10.1815 }; // Tunis par défaut
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: defaultLocation,
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true
    });

    this.map.addListener('click', (event: any) => {
      this.addMarker(event.latLng);
      this.reverseGeocode(event.latLng);
    });
  }

  private addMarker(location: any): void {
    if (this.marker) this.marker.setMap(null);
    
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    this.marker.addListener('dragend', () => {
      this.reverseGeocode(this.marker.getPosition());
    });
  }

  private reverseGeocode(latLng: any): void {
    this.geocoder.geocode({ location: latLng }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.updateLocationFields(
          results[0].formatted_address,
          latLng.lat(),
          latLng.lng()
        );
      }
    });
  }

  private updateLocationFields(address: string, lat: number, lng: number): void {
    this.eventForm.patchValue({
      location: address,
      latitude: lat,
      longitude: lng
    });
  }

  private updateMap(location: any): void {
    this.map.setCenter(location);
    this.addMarker(location);
    this.map.setZoom(15);
  }

  openMapModal(): void {
    Swal.fire({
      title: 'Select Location',
      html: '<div id="mapModal" style="height: 400px; width: 100%;"></div>',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Close',
      width: '800px',
      didOpen: () => {
        const modalMap = new google.maps.Map(
          document.getElementById('mapModal'), {
            center: this.marker?.getPosition() || { lat: 36.8065, lng: 10.1815 },
            zoom: 12,
            streetViewControl: false
          });
        
        if (this.marker) {
          new google.maps.Marker({
            position: this.marker.getPosition(),
            map: modalMap
          });
        }

        modalMap.addListener('click', (event: any) => {
          this.addMarker(event.latLng);
          this.reverseGeocode(event.latLng);
          Swal.close();
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.isSubmitting = true;

    if (this.eventForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    const newEvent: AppEvent = {
      idEvent: 0,
      nameEvent: this.eventForm.value.nameEvent,
      description: this.eventForm.value.description,
      dateEvent: new Date(this.eventForm.value.dateEvent).toISOString(),
      location: this.eventForm.value.location,
      latitude: this.eventForm.value.latitude,
      longitude: this.eventForm.value.longitude,
      goalAmount: parseFloat(this.eventForm.value.goalAmount)
    };

    this.eventService.addEvent(newEvent).subscribe(
      () => {
        Swal.fire({
          title: 'Success!',
          text: 'Event added successfully.',
          icon: 'success',
          confirmButtonColor: '#4361ee',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.eventForm.reset();
          this.submitted = false;
          this.isSubmitting = false;
          this.router.navigate(['/dashboard/eventback']);
        });
      },
      error => {
        console.error('Error adding event:', error);
        this.errorMessage = 'An error occurred while adding the event';
        this.isSubmitting = false;
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add event. Please try again.',
          icon: 'error',
          confirmButtonColor: '#e7515a',
        });
      }
    );
  }

  onCancel(): void {
    if (this.eventForm.pristine) {
      this.router.navigate(['/dashboard/eventback']);
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all unsaved changes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4361ee',
      cancelButtonColor: '#e7515a',
      confirmButtonText: 'Yes, discard changes',
      cancelButtonText: 'No, keep editing',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/dashboard/eventback']);
      }
    });
  }
}