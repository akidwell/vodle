import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredAccountComponent } from './insured-account.component';

describe('InsuredAccountComponent', () => {
  let component: InsuredAccountComponent;
  let fixture: ComponentFixture<InsuredAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
