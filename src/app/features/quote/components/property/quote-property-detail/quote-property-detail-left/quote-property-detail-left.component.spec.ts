import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePropertyDetailLeftComponent } from './quote-property-detail-left.component';

describe('QuotePropertyDetailLeftComponent', () => {
  let component: QuotePropertyDetailLeftComponent;
  let fixture: ComponentFixture<QuotePropertyDetailLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePropertyDetailLeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePropertyDetailLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
