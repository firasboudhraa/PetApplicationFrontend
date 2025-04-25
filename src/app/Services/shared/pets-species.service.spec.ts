import { TestBed } from '@angular/core/testing';

import { PetsSpeciesService } from './pets-species.service';

describe('PetsSpeciesService', () => {
  let service: PetsSpeciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetsSpeciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
