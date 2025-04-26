import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventbackComponent } from './eventback.component';

describe('EventbackComponent', () => {
  let component: EventbackComponent;
  let fixture: ComponentFixture<EventbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventbackComponent]
    });
    fixture = TestBed.createComponent(EventbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
