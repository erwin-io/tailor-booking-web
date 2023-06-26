import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalBodyComponent } from './internal-body.component';

describe('InternalBodyComponent', () => {
  let component: InternalBodyComponent;
  let fixture: ComponentFixture<InternalBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
