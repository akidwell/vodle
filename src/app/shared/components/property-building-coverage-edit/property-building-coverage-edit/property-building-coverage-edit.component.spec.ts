import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBuildingCoverageEditComponent } from './property-building-coverage-edit.component';

describe('PropertyBuildingCoverageEditComponent', () => {
  let component: PropertyBuildingCoverageEditComponent;
  let fixture: ComponentFixture<PropertyBuildingCoverageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyBuildingCoverageEditComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyBuildingCoverageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
