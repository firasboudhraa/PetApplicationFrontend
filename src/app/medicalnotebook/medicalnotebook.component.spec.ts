import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalnotebookComponent } from './medicalnotebook.component';

describe('MedicalnotebookComponent', () => {
  let component: MedicalnotebookComponent;
  let fixture: ComponentFixture<MedicalnotebookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalnotebookComponent]
    });
    fixture = TestBed.createComponent(MedicalnotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
