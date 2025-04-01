import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPetsComponent } from './user-pets.component';

describe('UserPetsComponent', () => {
  let component: UserPetsComponent;
  let fixture: ComponentFixture<UserPetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPetsComponent]
    });
    fixture = TestBed.createComponent(UserPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
