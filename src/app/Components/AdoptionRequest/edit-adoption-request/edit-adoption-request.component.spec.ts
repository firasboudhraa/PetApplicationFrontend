import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdoptionRequestComponent } from './edit-adoption-request.component';

describe('EditAdoptionRequestComponent', () => {
  let component: EditAdoptionRequestComponent;
  let fixture: ComponentFixture<EditAdoptionRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAdoptionRequestComponent]
    });
    fixture = TestBed.createComponent(EditAdoptionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
