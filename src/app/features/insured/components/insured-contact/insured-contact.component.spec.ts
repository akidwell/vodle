import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredContactComponent } from './insured-contact.component';

describe('InsuredContactComponent', () => {
  let component: InsuredContactComponent;
  let fixture: ComponentFixture<InsuredContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
