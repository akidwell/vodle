import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPropertyMortgageeComponent } from './policy-property-mortgagee.component';

describe('PolicyPropertyMortgageeComponent', () => {
  let component: PolicyPropertyMortgageeComponent;
  let fixture: ComponentFixture<PolicyPropertyMortgageeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyPropertyMortgageeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPropertyMortgageeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
