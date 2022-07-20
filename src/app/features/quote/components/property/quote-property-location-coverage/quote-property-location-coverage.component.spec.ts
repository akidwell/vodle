import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePropertyLocationCoverageComponent } from './quote-property-location-coverage.component';

describe('QuotePropertyLocationCoverageComponent', () => {
  let component: QuotePropertyLocationCoverageComponent;
  let fixture: ComponentFixture<QuotePropertyLocationCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePropertyLocationCoverageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePropertyLocationCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
