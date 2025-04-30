import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetStatsComponent } from './pet-stats.component';

describe('PetStatsComponent', () => {
  let component: PetStatsComponent;
  let fixture: ComponentFixture<PetStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetStatsComponent]
    });
    fixture = TestBed.createComponent(PetStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
