import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingPetComponent } from './matching-pet.component';

describe('MatchingPetComponent', () => {
  let component: MatchingPetComponent;
  let fixture: ComponentFixture<MatchingPetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchingPetComponent]
    });
    fixture = TestBed.createComponent(MatchingPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
