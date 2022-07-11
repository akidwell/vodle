import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePremiumComponent } from './quote-premium.component';

describe('QuotePremiumComponent', () => {
  let component: QuotePremiumComponent;
  let fixture: ComponentFixture<QuotePremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePremiumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
