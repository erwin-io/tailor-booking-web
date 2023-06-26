import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestViewComponent } from './guest-view.component';

describe('GuestViewComponent', () => {
  let component: GuestViewComponent;
  let fixture: ComponentFixture<GuestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
