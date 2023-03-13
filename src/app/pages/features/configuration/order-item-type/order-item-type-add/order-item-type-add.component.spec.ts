import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemTypeAddComponent } from './order-item-type-add.component';

describe('OrderItemTypeAddComponent', () => {
  let component: OrderItemTypeAddComponent;
  let fixture: ComponentFixture<OrderItemTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderItemTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
