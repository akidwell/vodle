import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyImportComponent } from './property-import.component';

describe('PropertyImportComponent', () => {
  let component: PropertyImportComponent;
  let fixture: ComponentFixture<PropertyImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
