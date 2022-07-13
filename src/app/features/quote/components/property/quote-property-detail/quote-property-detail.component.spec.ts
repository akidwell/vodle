import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePropertyDetailComponent } from './quote-property-detail.component';

describe('QuotePropertyDetailComponent', () => {
  let component: QuotePropertyDetailComponent;
  let fixture: ComponentFixture<QuotePropertyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePropertyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePropertyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
