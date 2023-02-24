import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageContractComponent } from './marriage-contract.component';

describe('MarriageContractComponent', () => {
  let component: MarriageContractComponent;
  let fixture: ComponentFixture<MarriageContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarriageContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarriageContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
