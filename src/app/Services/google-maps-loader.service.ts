import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  constructor() { }
  loader = new Loader({
    apiKey: this.getApiKey(),  // Use a method to retrieve the API key
    version: 'weekly',
    libraries: ['places']
  });

  load(): Promise<typeof google> {
    return this.loader.load();
  }

  private getApiKey(): string {
    return (window as any).__env?.GOOGLE_MAPS_API_KEY || ''; // Retrieve from a global environment variable
  }
}
