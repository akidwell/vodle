import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyReinsuranceComponent } from './policy-reinsurance.component';

describe('PolicyReinsuranceComponent', () => {
  let component: PolicyReinsuranceComponent;
  let fixture: ComponentFixture<PolicyReinsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyReinsuranceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyReinsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
