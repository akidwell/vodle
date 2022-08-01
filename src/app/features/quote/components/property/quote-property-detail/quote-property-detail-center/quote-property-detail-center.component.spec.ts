import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePropertyDetailCenterComponent } from './quote-property-detail-center.component';

describe('QuotePropertyDetailCenterComponent', () => {
  let component: QuotePropertyDetailCenterComponent;
  let fixture: ComponentFixture<QuotePropertyDetailCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePropertyDetailCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePropertyDetailCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
