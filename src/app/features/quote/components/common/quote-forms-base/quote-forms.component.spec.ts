import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteFormsComponent } from './quote-forms.component';

describe('QuoteFormsComponent', () => {
  let component: QuoteFormsComponent;
  let fixture: ComponentFixture<QuoteFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteFormsComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
