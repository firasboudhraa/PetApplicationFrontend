import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPetModalComponent } from './edit-pet-modal.component';

describe('EditPetModalComponent', () => {
  let component: EditPetModalComponent;
  let fixture: ComponentFixture<EditPetModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPetModalComponent]
    });
    fixture = TestBed.createComponent(EditPetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
