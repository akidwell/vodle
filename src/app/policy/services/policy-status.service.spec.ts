import { TestBed } from '@angular/core/testing';

import { PolicyStatusService } from './policy-status.service';

describe('PolicyStatusService', () => {
  let service: PolicyStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
