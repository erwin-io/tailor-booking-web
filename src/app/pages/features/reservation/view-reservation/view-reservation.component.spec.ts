import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReservationComponent } from './view-reservation.component';

describe('ViewAppointmentComponent', () => {
  let component: ViewReservationComponent;
  let fixture: ComponentFixture<ViewReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReservationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
