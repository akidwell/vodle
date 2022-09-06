import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLineItemsGroupComponent } from './quote-line-items-group.component';

describe('QuoteLineItemsGroupComponent', () => {
  let component: QuoteLineItemsGroupComponent;
  let fixture: ComponentFixture<QuoteLineItemsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteLineItemsGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLineItemsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
