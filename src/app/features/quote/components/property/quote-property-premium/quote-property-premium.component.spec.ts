import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePropertyPremiumComponent } from './quote-property-premium.component';

describe('QuotePropertyPremiumComponent', () => {
  let component: QuotePropertyPremiumComponent;
  let fixture: ComponentFixture<QuotePropertyPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePropertyPremiumComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePropertyPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
