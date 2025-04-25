import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetSittingSpaceComponent } from './pet-sitting-space.component';

describe('PetSittingSpaceComponent', () => {
  let component: PetSittingSpaceComponent;
  let fixture: ComponentFixture<PetSittingSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetSittingSpaceComponent]
    });
    fixture = TestBed.createComponent(PetSittingSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
