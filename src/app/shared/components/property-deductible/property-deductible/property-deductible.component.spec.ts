import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDeductibleComponent } from './property-deductible.component';

describe('PropertyDeductibleComponent', () => {
  let component: PropertyDeductibleComponent;
  let fixture: ComponentFixture<PropertyDeductibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDeductibleComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDeductibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
