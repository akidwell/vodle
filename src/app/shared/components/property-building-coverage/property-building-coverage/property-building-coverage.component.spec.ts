import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBuildingCoverageComponent } from './property-building-coverage.component';

describe('PropertyBuildingCoverageComponent', () => {
  let component: PropertyBuildingCoverageComponent;
  let fixture: ComponentFixture<PropertyBuildingCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyBuildingCoverageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyBuildingCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
