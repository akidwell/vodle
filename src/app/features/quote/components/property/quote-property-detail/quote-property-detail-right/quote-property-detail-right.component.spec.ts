import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePropertyDetailRightComponent } from './quote-property-detail-right.component';

describe('QuotePropertyDetailRightComponent', () => {
  let component: QuotePropertyDetailRightComponent;
  let fixture: ComponentFixture<QuotePropertyDetailRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePropertyDetailRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePropertyDetailRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
