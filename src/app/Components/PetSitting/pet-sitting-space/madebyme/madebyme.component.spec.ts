import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadebymeComponent } from './madebyme.component';

describe('MadebymeComponent', () => {
  let component: MadebymeComponent;
  let fixture: ComponentFixture<MadebymeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MadebymeComponent]
    });
    fixture = TestBed.createComponent(MadebymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
