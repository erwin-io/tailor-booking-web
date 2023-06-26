import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalTopComponent } from './internal-top.component';

describe('InternalTopComponent', () => {
  let component: InternalTopComponent;
  let fixture: ComponentFixture<InternalTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
