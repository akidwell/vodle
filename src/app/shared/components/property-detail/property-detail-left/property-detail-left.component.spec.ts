import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailLeftComponent } from './property-detail-left.component';

describe('QuotePropertyDetailLeftComponent', () => {
  let component: PropertyDetailLeftComponent;
  let fixture: ComponentFixture<PropertyDetailLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDetailLeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
