import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPremiumComponent } from './policy-premium.component';

describe('PolicyPremiumComponent', () => {
  let component: PolicyPremiumComponent;
  let fixture: ComponentFixture<PolicyPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyPremiumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
