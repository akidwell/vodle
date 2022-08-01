import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBuildingGroupComponent } from './property-building-group.component';

describe('PropertyBuildingGroupComponent', () => {
  let component: PropertyBuildingGroupComponent;
  let fixture: ComponentFixture<PropertyBuildingGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyBuildingGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyBuildingGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
