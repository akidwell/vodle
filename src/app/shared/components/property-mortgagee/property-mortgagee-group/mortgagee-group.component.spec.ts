import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageeGroupComponent } from './mortgagee-group.component';

describe('QuoteMortgageeGroupComponent', () => {
  let component: MortgageeGroupComponent;
  let fixture: ComponentFixture<MortgageeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortgageeGroupComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
