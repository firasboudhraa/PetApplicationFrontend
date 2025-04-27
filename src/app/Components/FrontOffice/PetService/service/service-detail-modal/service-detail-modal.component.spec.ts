import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailModalComponent } from './service-detail-modal.component';

describe('ServiceDetailModalComponent', () => {
  let component: ServiceDetailModalComponent;
  let fixture: ComponentFixture<ServiceDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceDetailModalComponent]
    });
    fixture = TestBed.createComponent(ServiceDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
