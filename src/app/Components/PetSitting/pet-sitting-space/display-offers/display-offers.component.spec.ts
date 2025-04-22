import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOffersComponent } from './display-offers.component';

describe('DisplayOffersComponent', () => {
  let component: DisplayOffersComponent;
  let fixture: ComponentFixture<DisplayOffersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayOffersComponent]
    });
    fixture = TestBed.createComponent(DisplayOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
