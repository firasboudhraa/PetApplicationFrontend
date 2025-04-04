import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptionRequestDashbordComponent } from './adoption-request-dashbord.component';

describe('AdoptionRequestDashbordComponent', () => {
  let component: AdoptionRequestDashbordComponent;
  let fixture: ComponentFixture<AdoptionRequestDashbordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdoptionRequestDashbordComponent]
    });
    fixture = TestBed.createComponent(AdoptionRequestDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
