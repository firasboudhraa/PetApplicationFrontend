import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  constructor() { }
  loader = new Loader({
    apiKey: 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao',  // <-- replace with your actual API key
    version: 'weekly',
  });

  load(): Promise<typeof google> {
    return this.loader.load();
  }
}
