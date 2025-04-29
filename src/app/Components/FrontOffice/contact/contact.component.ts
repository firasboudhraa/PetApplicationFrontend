import { Component, AfterViewInit } from '@angular/core';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements AfterViewInit {
  map: any;

  constructor(private mapsLoader: GoogleMapsLoaderService) {}

  ngAfterViewInit() {
    this.mapsLoader.load().then(() => {
      if (typeof google !== 'undefined' && google.maps) {
        this.initMap(google.maps);
      } else {
        console.error("Google Maps API failed to load.");
      }
    }).catch(err => {
      console.error("Google Maps failed to load: ", err);
    });
  }

  initMap(googleMaps: any) {
    const mapElement = document.getElementById('map');
    const defaultCenter = { lat: 36.8065, lng: 10.1815 }; // Example: Tunis coordinates
    if (!mapElement) return;

    this.map = new googleMaps.Map(mapElement, {
      center: defaultCenter,
      zoom: 14,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    // Optional: Add a custom marker
    new googleMaps.Marker({
      position: defaultCenter,
      map: this.map,
      title: 'Our Location',
      animation: googleMaps.Animation.DROP
    });
  }
}
