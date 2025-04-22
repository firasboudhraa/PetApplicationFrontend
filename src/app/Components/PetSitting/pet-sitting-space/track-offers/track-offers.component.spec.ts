import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackOffersComponent } from './track-offers.component';

describe('TrackOffersComponent', () => {
  let component: TrackOffersComponent;
  let fixture: ComponentFixture<TrackOffersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackOffersComponent]
    });
    fixture = TestBed.createComponent(TrackOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
