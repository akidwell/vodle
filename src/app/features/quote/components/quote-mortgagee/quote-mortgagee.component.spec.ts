import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteMortgageeComponent } from './quote-mortgagee.component';


describe('QuoteMortgageeComponent', () => {
  let component: QuoteMortgageeComponent;
  let fixture: ComponentFixture<QuoteMortgageeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteMortgageeComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteMortgageeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
