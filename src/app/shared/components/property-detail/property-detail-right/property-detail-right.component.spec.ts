import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailRightComponent } from './property-detail-right.component';

describe('QuotePropertyDetailRightComponent', () => {
  let component: PropertyDetailRightComponent;
  let fixture: ComponentFixture<PropertyDetailRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDetailRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
