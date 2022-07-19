import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPremiumComponent } from './property-premium.component';

describe('PropertyPremiumComponent', () => {
  let component: PropertyPremiumComponent;
  let fixture: ComponentFixture<PropertyPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyPremiumComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
