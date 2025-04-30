import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptionRequestProfileComponent } from './adoption-request-profile.component';

describe('AdoptionRequestProfileComponent', () => {
  let component: AdoptionRequestProfileComponent;
  let fixture: ComponentFixture<AdoptionRequestProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdoptionRequestProfileComponent]
    });
    fixture = TestBed.createComponent(AdoptionRequestProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
