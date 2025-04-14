import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PetsSpeciesService {
  speciesOption = [
    { label: 'Cat', value: 'cat' },
    { label: 'Dog', value: 'dog' },
    { label: 'Bird', value: 'bird' },
  ];
  constructor() { }
}
