import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementCoverageLocationComponent } from './endorsement-coverage-location.component';

describe('EndorsementCoverageLocationComponent', () => {
  let component: EndorsementCoverageLocationComponent;
  let fixture: ComponentFixture<EndorsementCoverageLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementCoverageLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementCoverageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
