import { TestBed } from '@angular/core/testing';

import { SubmissionActivityService } from './submission-activity.service';

describe('SubmissionActivityService', () => {
  let service: SubmissionActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
