import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteInformationDetailComponent } from './quote-information-detail.component';

describe('QuoteInformationDetailComponent', () => {
  let component: QuoteInformationDetailComponent;
  let fixture: ComponentFixture<QuoteInformationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteInformationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteInformationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
