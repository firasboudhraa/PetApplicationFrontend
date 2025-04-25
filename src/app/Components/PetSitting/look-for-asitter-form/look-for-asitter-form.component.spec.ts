import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookForASitterFormComponent } from './look-for-asitter-form.component';

describe('LookForASitterFormComponent', () => {
  let component: LookForASitterFormComponent;
  let fixture: ComponentFixture<LookForASitterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LookForASitterFormComponent]
    });
    fixture = TestBed.createComponent(LookForASitterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
