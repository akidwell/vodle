import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredAccountRightComponent } from './insured-account-right.component';

describe('InsuredAccountRightComponent', () => {
  let component: InsuredAccountRightComponent;
  let fixture: ComponentFixture<InsuredAccountRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredAccountRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredAccountRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
