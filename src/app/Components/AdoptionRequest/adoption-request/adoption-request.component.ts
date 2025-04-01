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
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    this.map = new google.maps.Map(mapEl, {
      center: { lat: 36.8065, lng: 10.1815 }, // Tunis
      zoom: 12
    });

    this.map.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      this.location = `${lat}, ${lng}`;
      this.adoptionForm.controls['location'].setValue(this.location);

      if (this.marker) this.marker.setMap(null);

      this.marker = new google.maps.Marker({
        position: e.latLng,
        map: this.map,
        title: 'Selected Location'
      });
    });

    this.isMapReady = true;
  }
}
