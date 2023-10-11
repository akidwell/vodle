import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPropertyLocationCoverageComponent } from './policy-property-location-coverage.component';

describe('PolicyPropertyLocationCoverageComponent', () => {
  let component: PolicyPropertyLocationCoverageComponent;
  let fixture: ComponentFixture<PolicyPropertyLocationCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyPropertyLocationCoverageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPropertyLocationCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
