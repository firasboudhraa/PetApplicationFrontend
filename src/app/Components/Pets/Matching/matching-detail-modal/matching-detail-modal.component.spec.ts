import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingDetailModalComponent } from './matching-detail-modal.component';

describe('MatchingDetailModalComponent', () => {
  let component: MatchingDetailModalComponent;
  let fixture: ComponentFixture<MatchingDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchingDetailModalComponent]
    });
    fixture = TestBed.createComponent(MatchingDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
