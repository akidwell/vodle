import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPremiumRateComponent } from './property-premium-rate.component';

describe('PropertyPremiumRateComponent', () => {
  let component: PropertyPremiumRateComponent;
  let fixture: ComponentFixture<PropertyPremiumRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyPremiumRateComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPremiumRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
