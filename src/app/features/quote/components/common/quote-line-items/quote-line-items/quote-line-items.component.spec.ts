import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLineItemsComponent } from './quote-line-items.component';

describe('QuoteLineItemsComponent', () => {
  let component: QuoteLineItemsComponent;
  let fixture: ComponentFixture<QuoteLineItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteLineItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
