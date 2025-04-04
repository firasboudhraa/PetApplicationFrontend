import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  constructor() { }
  loader = new Loader({
    apiKey: this.getApiKey(),
    version: 'weekly',
    libraries: ['places']
  });

  load(): Promise<typeof google> {
    return this.loader.load();
  }

  getLocationInLetters(location: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (location) {
        const [latStr, lngStr] = location.split(',').map(coord => coord.trim());
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (!isNaN(lat) && !isNaN(lng)) {
          this.load().then(() => {
            const geocoder = new google.maps.Geocoder();
            const latlng = { lat, lng };
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === 'OK') {
                if (results && results[0]) {
                  resolve(results[0].formatted_address);
                } else {
                  console.warn('No results found');
                  resolve('Unknown location');
                }
              } else {
                console.error('Geocoder failed due to: ' + status);
                reject('Geocoder failed');
              }
            });
          }).catch(err => {
            console.error('Google Maps failed to load:', err);
            reject('Google Maps not loaded');
          });
        } else {
          resolve('Invalid coordinates');
        }
      } else {
        resolve('Unknown location');
      }
    });
  }

  private getApiKey(): string {
    return (window as any).__env?.GOOGLE_MAPS_API_KEY || '';
  }
}
