import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPetCardComponent } from './public-pet-card.component';

describe('PublicPetCardComponent', () => {
  let component: PublicPetCardComponent;
  let fixture: ComponentFixture<PublicPetCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicPetCardComponent]
    });
    fixture = TestBed.createComponent(PublicPetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
