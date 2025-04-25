import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedRequestComponent } from './received-request.component';

describe('ReceivedRequestComponent', () => {
  let component: ReceivedRequestComponent;
  let fixture: ComponentFixture<ReceivedRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivedRequestComponent]
    });
    fixture = TestBed.createComponent(ReceivedRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
