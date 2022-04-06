import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderlyingCoverageLimitBasisComponent } from './underlying-coverage-limit-basis.component';

describe('UnderlyingCoverageLimitBasisComponent', () => {
  let component: UnderlyingCoverageLimitBasisComponent;
  let fixture: ComponentFixture<UnderlyingCoverageLimitBasisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderlyingCoverageLimitBasisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderlyingCoverageLimitBasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
