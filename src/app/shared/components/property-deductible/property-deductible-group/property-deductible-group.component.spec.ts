import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDeductibleGroupComponent } from './property-deductible-group.component';

describe('PropertyDeductibleGroupComponent', () => {
  let component: PropertyDeductibleGroupComponent;
  let fixture: ComponentFixture<PropertyDeductibleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDeductibleGroupComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDeductibleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
