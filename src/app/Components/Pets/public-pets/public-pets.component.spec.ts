import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPetsComponent } from './public-pets.component';

describe('PublicPetsComponent', () => {
  let component: PublicPetsComponent;
  let fixture: ComponentFixture<PublicPetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicPetsComponent]
    });
    fixture = TestBed.createComponent(PublicPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
