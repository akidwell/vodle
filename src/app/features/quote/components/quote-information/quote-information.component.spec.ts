import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteInformationComponent } from './quote-information.component';

describe('QuoteInformationComponent', () => {
  let component: QuoteInformationComponent;
  let fixture: ComponentFixture<QuoteInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
