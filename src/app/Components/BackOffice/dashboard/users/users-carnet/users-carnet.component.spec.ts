import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCarnetComponent } from './users-carnet.component';

describe('UsersCarnetComponent', () => {
  let component: UsersCarnetComponent;
  let fixture: ComponentFixture<UsersCarnetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersCarnetComponent]
    });
    fixture = TestBed.createComponent(UsersCarnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
