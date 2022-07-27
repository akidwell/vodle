import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBuildingCoverageGroupComponent } from './property-building-coverage-group.component';

describe('PropertyBuildingCoverageGroupComponent', () => {
  let component: PropertyBuildingCoverageGroupComponent;
  let fixture: ComponentFixture<PropertyBuildingCoverageGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyBuildingCoverageGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyBuildingCoverageGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
