import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPetDetailModalComponent } from './public-pet-detail-modal.component';

describe('PublicPetDetailModalComponent', () => {
  let component: PublicPetDetailModalComponent;
  let fixture: ComponentFixture<PublicPetDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicPetDetailModalComponent]
    });
    fixture = TestBed.createComponent(PublicPetDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
