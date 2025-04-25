import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentRequestComponent } from './sent-request.component';

describe('SentRequestComponent', () => {
  let component: SentRequestComponent;
  let fixture: ComponentFixture<SentRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentRequestComponent]
    });
    fixture = TestBed.createComponent(SentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
