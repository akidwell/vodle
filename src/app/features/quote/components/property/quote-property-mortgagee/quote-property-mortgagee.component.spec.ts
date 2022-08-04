import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePropertyMortgageeComponent } from './quote-property-mortgagee.component';

describe('QuotePropertyMortgageeComponent', () => {
  let component: QuotePropertyMortgageeComponent;
  let fixture: ComponentFixture<QuotePropertyMortgageeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePropertyMortgageeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePropertyMortgageeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
