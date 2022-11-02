import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFormsSearchComponent } from './policy-forms-search.component';

describe('PolicyFormsSearchComponent', () => {
  let component: PolicyFormsSearchComponent;
  let fixture: ComponentFixture<PolicyFormsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyFormsSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyFormsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
