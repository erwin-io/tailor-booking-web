import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerInfoComponent } from './view-customer-info.component';

describe('ViewCustomerInfoComponent', () => {
  let component: ViewCustomerInfoComponent;
  let fixture: ComponentFixture<ViewCustomerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
