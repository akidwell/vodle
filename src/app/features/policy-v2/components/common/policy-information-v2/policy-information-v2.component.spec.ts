import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyInformationV2Component } from './policy-information-v2.component';

describe('PolicyInformationV2Component', () => {
  let component: PolicyInformationV2Component;
  let fixture: ComponentFixture<PolicyInformationV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyInformationV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyInformationV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
