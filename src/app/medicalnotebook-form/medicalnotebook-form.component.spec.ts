import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalnotebookFormComponent } from './medicalnotebook-form.component';

describe('MedicalnotebookFormComponent', () => {
  let component: MedicalnotebookFormComponent;
  let fixture: ComponentFixture<MedicalnotebookFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalnotebookFormComponent]
    });
    fixture = TestBed.createComponent(MedicalnotebookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
