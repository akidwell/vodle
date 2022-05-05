import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredAccountCenterComponent } from './insured-account-center.component';

describe('InsuredAccountCenterComponent', () => {
  let component: InsuredAccountCenterComponent;
  let fixture: ComponentFixture<InsuredAccountCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredAccountCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredAccountCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
