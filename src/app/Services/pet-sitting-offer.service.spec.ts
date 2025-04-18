import { TestBed } from '@angular/core/testing';

import { PetSittingOfferService } from './pet-sitting-offer.service';

describe('PetSittingOfferService', () => {
  let service: PetSittingOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetSittingOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
