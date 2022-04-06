import { TestBed } from '@angular/core/testing';

import { JobLoggerService } from './job-logger.service';

describe('JobLoggerService', () => {
  let service: JobLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
