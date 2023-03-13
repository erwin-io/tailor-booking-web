import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemTypeComponent } from './order-item-type.component';

describe('OrderItemTypeComponent', () => {
  let component: OrderItemTypeComponent;
  let fixture: ComponentFixture<OrderItemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderItemTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
