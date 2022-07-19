import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteProgramBaseComponent } from './quote-program-base.component';

describe('QuoteProgramBaseComponent', () => {
  let component: QuoteProgramBaseComponent;
  let fixture: ComponentFixture<QuoteProgramBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteProgramBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteProgramBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
