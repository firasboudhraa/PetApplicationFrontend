import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarUserComponent } from './side-bar-user.component';

describe('SideBarUserComponent', () => {
  let component: SideBarUserComponent;
  let fixture: ComponentFixture<SideBarUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarUserComponent]
    });
    fixture = TestBed.createComponent(SideBarUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
