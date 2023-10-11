import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementCoverageComponent } from './endorsement-coverage.component';

describe('EndorsementCoverageComponent', () => {
  let component: EndorsementCoverageComponent;
  let fixture: ComponentFixture<EndorsementCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementCoverageComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
