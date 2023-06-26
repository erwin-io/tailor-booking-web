import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatYearPickerComponent } from './mat-year-picker.component';

describe('MatYearPickerComponent', () => {
  let component: MatYearPickerComponent;
  let fixture: ComponentFixture<MatYearPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatYearPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatYearPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
