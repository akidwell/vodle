import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredAccountAddressComponent } from './insured-account-address.component';

describe('InsuredAccountAddressComponent', () => {
  let component: InsuredAccountAddressComponent;
  let fixture: ComponentFixture<InsuredAccountAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredAccountAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredAccountAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
