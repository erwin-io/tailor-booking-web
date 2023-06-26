import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalViewComponent } from './internal-view.component';

describe('InternalViewComponent', () => {
  let component: InternalViewComponent;
  let fixture: ComponentFixture<InternalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
