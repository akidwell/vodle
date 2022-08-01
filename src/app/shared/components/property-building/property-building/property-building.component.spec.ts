import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBuildingComponent } from './property-building.component';

describe('PropertyBuildingComponent', () => {
  let component: PropertyBuildingComponent;
  let fixture: ComponentFixture<PropertyBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyBuildingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
