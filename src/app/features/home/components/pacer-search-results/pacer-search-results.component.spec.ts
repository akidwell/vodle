import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacerSearchResultsComponent } from './pacer-search-results.component';

describe('PacerSearchResultsComponent', () => {
  let component: PacerSearchResultsComponent;
  let fixture: ComponentFixture<PacerSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacerSearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacerSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
