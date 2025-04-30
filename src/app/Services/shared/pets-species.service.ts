import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PetsSpeciesService {
  speciesOption = [
    { label: 'Cat', value: 'Cat' },
    { label: 'Dog', value: 'Dog' },
    { label: 'Bird', value: 'Bird' },
    { label: 'Monkey', value: 'Monkey' },
    { label: 'Cow', value: 'Cow' },
  ];
  constructor() { }
}
