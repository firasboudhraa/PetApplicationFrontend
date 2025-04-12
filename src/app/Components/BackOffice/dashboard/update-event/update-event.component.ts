import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/Services/event-service.service';
import { Event as AppEvent } from 'src/app/models/event';
import Swal from 'sweetalert2';

declare var google: any;

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit, AfterViewInit {
  @ViewChild('locationSearch') locationSearch!: ElementRef;
  private map: any;
  private marker: any;
  private autocomplete: any;
  private geocoder: any;

  eventForm: FormGroup;
  eventId!: number;
  isSubmitting = false;
  errorMessage = '';
  originalEventData: AppEvent | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      nameEvent: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateEvent: ['', Validators.required],
      location: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      goalAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEventData();
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
      streetViewControl: false
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
      draggable: true
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
            zoom: 12
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

  loadEventData(): void {
    this.eventService.getEventById(this.eventId).subscribe(
      (event: AppEvent) => {
        this.originalEventData = {...event};
        
        const eventDate = new Date(event.dateEvent);
        const formattedDate = eventDate.toISOString().substring(0, 16);
        
        this.eventForm.patchValue({
          nameEvent: event.nameEvent,
          description: event.description,
          dateEvent: formattedDate,
          location: event.location,
          latitude: event.latitude,
          longitude: event.longitude,
          goalAmount: event.goalAmount
        });

        if (event.latitude && event.longitude) {
          const location = new google.maps.LatLng(event.latitude, event.longitude);
          this.updateMap(location);
        }
      },
      error => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load event data',
          icon: 'error',
          confirmButtonColor: '#e7515a',
        }).then(() => {
          this.router.navigate(['/dashboard/eventback']);
        });
      }
    );
  }

  hasChanges(): boolean {
    if (!this.originalEventData) return false;
    
    const formData = this.eventForm.value;
    return (
      formData.nameEvent !== this.originalEventData.nameEvent ||
      formData.description !== this.originalEventData.description ||
      new Date(formData.dateEvent).toISOString() !== this.originalEventData.dateEvent ||
      formData.location !== this.originalEventData.location ||
      parseFloat(formData.goalAmount) !== this.originalEventData.goalAmount
    );
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      Object.values(this.eventForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const updatedEvent: AppEvent = {
      idEvent: this.eventId,
      ...this.eventForm.value,
      dateEvent: new Date(this.eventForm.value.dateEvent).toISOString()
    };

    this.eventService.updateEvent(this.eventId, updatedEvent).subscribe(
      () => {
        Swal.fire({
          title: 'Success!',
          text: 'Event updated successfully',
          icon: 'success',
          confirmButtonColor: '#4361ee',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.router.navigate(['/dashboard/eventback']);
        });
      },
      error => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update event. Please try again.',
          icon: 'error',
          confirmButtonColor: '#e7515a',
        });
        this.isSubmitting = false;
      }
    );
  }

  onCancel(): void {
    if (!this.hasChanges()) {
      this.router.navigate(['/dashboard/eventback']);
      return;
    }

    Swal.fire({
      title: 'Unsaved Changes',
      text: 'You have unsaved changes. Are you sure you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4361ee',
      cancelButtonColor: '#e7515a',
      confirmButtonText: 'Yes, discard changes',
      cancelButtonText: 'No, stay',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/dashboard/eventback']);
      }
    });
  }
}