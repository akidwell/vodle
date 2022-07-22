import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalInterestComponent } from './additional-interest.component';


describe('QuoteMortgageeComponent', () => {
  let component: AdditionalInterestComponent;
  let fixture: ComponentFixture<AdditionalInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalInterestComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
