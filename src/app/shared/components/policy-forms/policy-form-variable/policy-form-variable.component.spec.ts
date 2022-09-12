import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFormVariableComponent } from './policy-form-variable.component';

describe('PolicyFormVariableComponent', () => {
  let component: PolicyFormVariableComponent;
  let fixture: ComponentFixture<PolicyFormVariableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyFormVariableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyFormVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
