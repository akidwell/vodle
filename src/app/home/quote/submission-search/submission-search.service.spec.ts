import { TestBed } from '@angular/core/testing';

import { SubmissionSearchService } from './submission-search.service';

describe('SubmissionSearchService', () => {
  let service: SubmissionSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
