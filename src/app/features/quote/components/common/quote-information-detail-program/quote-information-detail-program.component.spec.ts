import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteInformationDetailProgramComponent } from './quote-information-detail-program.component';

describe('QuoteInformationDetailProgramComponent', () => {
  let component: QuoteInformationDetailProgramComponent;
  let fixture: ComponentFixture<QuoteInformationDetailProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteInformationDetailProgramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteInformationDetailProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
