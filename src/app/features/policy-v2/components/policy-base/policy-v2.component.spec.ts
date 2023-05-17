import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyV2Component } from './policy-v2.component';

describe('PolicyV2Component', () => {
  let component: PolicyV2Component;
  let fixture: ComponentFixture<PolicyV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
