import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPremiumDeductibleComponent } from './property-premium-deductible.component';

describe('PropertyPremiumDeductibleComponent', () => {
  let component: PropertyPremiumDeductibleComponent;
  let fixture: ComponentFixture<PropertyPremiumDeductibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyPremiumDeductibleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPremiumDeductibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
