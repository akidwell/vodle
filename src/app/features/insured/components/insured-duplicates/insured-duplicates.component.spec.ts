import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredDuplicatesComponent } from './insured-duplicates.component';

describe('InsuredDuplicatesComponent', () => {
  let component: InsuredDuplicatesComponent;
  let fixture: ComponentFixture<InsuredDuplicatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredDuplicatesComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredDuplicatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
