import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetCardComponent } from './pet-card.component';

describe('PetCardComponent', () => {
  let component: PetCardComponent;
  let fixture: ComponentFixture<PetCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetCardComponent]
    });
    fixture = TestBed.createComponent(PetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
