import { TestBed } from '@angular/core/testing';

import { PolicyIssuanceService } from './policy-issuance.service';

describe('PolicyIssuanceServiceService', () => {
  let service: PolicyIssuanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyIssuanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
