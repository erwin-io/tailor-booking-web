import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaptismalComponent } from './baptismal.component';

describe('BaptismalComponent', () => {
  let component: BaptismalComponent;
  let fixture: ComponentFixture<BaptismalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaptismalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaptismalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
