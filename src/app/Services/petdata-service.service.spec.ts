import { TestBed } from '@angular/core/testing';

import { PetdataServiceService } from './petdata-service.service';

describe('PetdataServiceService', () => {
  let service: PetdataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetdataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
