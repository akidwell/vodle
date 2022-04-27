import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSearchResultsComponent } from './submission-search-results.component';

describe('SubmissionSearchResultsComponent', () => {
  let component: SubmissionSearchResultsComponent;
  let fixture: ComponentFixture<SubmissionSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionSearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
