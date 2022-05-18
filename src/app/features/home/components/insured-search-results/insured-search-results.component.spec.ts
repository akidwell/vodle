import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredSearchResultsComponent } from './insured-search-results.component';

describe('InsuredSearchResultsComponent', () => {
  let component: InsuredSearchResultsComponent;
  let fixture: ComponentFixture<InsuredSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredSearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
