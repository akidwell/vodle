import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementCoverageLocationGroupComponent } from './endorsement-coverage-location-group.component';

describe('EndorsementCoveragesComponent', () => {
  let component: EndorsementCoverageLocationGroupComponent;
  let fixture: ComponentFixture<EndorsementCoverageLocationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementCoverageLocationGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementCoverageLocationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
