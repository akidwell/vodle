import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBuildingCoverageEditDialogComponent } from './property-building-coverage-group-edit-dialog.component';

describe('PropertyBuildingCoverageEditDialogComponent', () => {
  let component: PropertyBuildingCoverageEditDialogComponent;
  let fixture: ComponentFixture<PropertyBuildingCoverageEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyBuildingCoverageEditDialogComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyBuildingCoverageEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
