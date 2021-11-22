import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderlyingCoverageDetailComponent } from './underlying-coverage-detail.component';

describe('UnderlyingCoverageDetailComponent', () => {
  let component: UnderlyingCoverageDetailComponent;
  let fixture: ComponentFixture<UnderlyingCoverageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderlyingCoverageDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderlyingCoverageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
