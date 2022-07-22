import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MortgageeComponent } from './mortgagee.component';


describe('QuoteMortgageeComponent', () => {
  let component: MortgageeComponent;
  let fixture: ComponentFixture<MortgageeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortgageeComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
