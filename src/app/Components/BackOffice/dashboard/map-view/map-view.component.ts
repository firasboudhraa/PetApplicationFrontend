import { Component, AfterViewInit } from '@angular/core';
import { PetServiceService } from 'src/app/Services/pet-service.service'; // Your service to fetch services
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service'; // Your service to load Google Maps
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  services: any[] = [];
  map: any;

  constructor(
    private petService: PetServiceService,
    private mapsLoader: GoogleMapsLoaderService,
    private router: Router // Inject Router
  ) {}

  ngAfterViewInit() {
    // Load the Google Maps API after the view is initialized
    this.mapsLoader.load().then(() => {
      if (typeof google !== 'undefined' && google.maps) {
        this.initMap(google.maps); // Ensure google.maps is loaded
        this.petService.getServices().subscribe({
          next: (data) => {
            this.services = data; // Assuming data is an array of services
            console.log(this.services);
            this.addMarkersToMap(google.maps); // Add markers once the services are fetched
          },
          error: (err) => {
            console.error('Error fetching services:', err);
          }
        });
      } else {
        console.error("Google Maps API failed to load.");
      }
    }).catch(err => {
      console.error("Google Maps failed to load: ", err);
    });
  }

  initMap(googleMaps: any) {
    const mapElement = document.getElementById('map');
    const defaultCenter = { lat: 36.8065, lng: 10.1815 }; 
    if (!mapElement) return;

    this.map = new googleMaps.Map(mapElement, {
      center: defaultCenter,
      zoom: 12
    });
  }

  addMarkersToMap(googleMaps: any) {
    const bounds = new googleMaps.LatLngBounds();

    // If services are available, add a marker for each one
    this.services.forEach(service => {
      const address = service.address || '123 Main St, Springfield, IL'; 

      if (!address || address.trim() === '') {
        console.warn('Service has no valid address.');
        return;
      }

      this.geocodeAddress(address, googleMaps).then((location) => {
        if (location) {
          const marker = new googleMaps.Marker({
            position: location,
            map: this.map,
            title: service.name, // Display service name on hover
            cursor: 'pointer' // Show pointer cursor on hover
          });

          bounds.extend(location);

          marker.addListener('click', () => {
            this.router.navigate(['/dashboard/update-service', service.idService]);
          });

          this.map.setCenter(location);
        }
      }).catch((err) => {
        console.error("Geocoding failed: ", err);
      });
    });

    this.map.fitBounds(bounds);
  }

  geocodeAddress(address: string, googleMaps: any): Promise<google.maps.LatLng | null> {
    return new Promise((resolve, reject) => {
      const geocoder = new googleMaps.Geocoder();

      geocoder.geocode({ address: address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {

        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve(location);
        } else {

          if (status === 'ZERO_RESULTS') {
            const addressWithCountry = `${address}, Tunisie`;
            console.log('Retrying with address:', addressWithCountry);
            geocoder.geocode({ address: addressWithCountry }, (retryResults: google.maps.GeocoderResult[], retryStatus: google.maps.GeocoderStatus) => {
              if (retryStatus === 'OK' && retryResults[0]) {
                const retryLocation = retryResults[0].geometry.location;
                resolve(retryLocation);
              } else {
                reject(`Geocode failed after retry for address: ${addressWithCountry}`);
              }
            });
          } else {
            reject(`Geocode was not successful for the following reason: ${status}`);
          }
        }
      });
    });
  }
}
