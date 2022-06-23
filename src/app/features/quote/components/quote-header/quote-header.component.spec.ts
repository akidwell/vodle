import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteHeaderComponent } from './quote-header.component';

describe('QuoteHeaderComponent', () => {
  let component: QuoteHeaderComponent;
  let fixture: ComponentFixture<QuoteHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
