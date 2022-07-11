import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteTermsConditionsComponent } from './quote-terms-conditions.component';

describe('QuoteTermsConditionsComponent', () => {
  let component: QuoteTermsConditionsComponent;
  let fixture: ComponentFixture<QuoteTermsConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteTermsConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
