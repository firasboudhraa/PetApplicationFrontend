import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPetsProfileComponent } from './my-pets-profile.component';

describe('MyPetsProfileComponent', () => {
  let component: MyPetsProfileComponent;
  let fixture: ComponentFixture<MyPetsProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPetsProfileComponent]
    });
    fixture = TestBed.createComponent(MyPetsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
