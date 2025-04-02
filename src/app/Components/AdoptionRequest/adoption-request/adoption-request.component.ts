import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GoogleMapsLoaderService } from 'src/app/Services/google-maps-loader.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private mapsLoader: GoogleMapsLoaderService
  ) {}

  ngOnInit(): void {
    this.adoptionForm = this.fb.group({
      location: ['']
    });

    this.mapsLoader.load().then(() => {
      this.initMap();
    }).catch(err => {
      console.error('Google Maps failed to load', err);
    });
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
        position: event.latLng
      });
  
      this.adoptionForm.controls['location'].setValue(latlng);
    });
  }
  
  
}
