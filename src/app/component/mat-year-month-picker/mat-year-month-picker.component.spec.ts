import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatYearMonthPickerComponent } from './mat-year-month-picker.component';

describe('MatYearMonthPickerComponent', () => {
  let component: MatYearMonthPickerComponent;
  let fixture: ComponentFixture<MatYearMonthPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatYearMonthPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatYearMonthPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
