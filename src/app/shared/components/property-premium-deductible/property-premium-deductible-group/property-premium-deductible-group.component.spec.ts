import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPremiumDeductibleGroupComponent } from './property-premium-deductible-group.component';

describe('PropertyPremiumDeductibleGroupComponent', () => {
  let component: PropertyPremiumDeductibleGroupComponent;
  let fixture: ComponentFixture<PropertyPremiumDeductibleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyPremiumDeductibleGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPremiumDeductibleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
