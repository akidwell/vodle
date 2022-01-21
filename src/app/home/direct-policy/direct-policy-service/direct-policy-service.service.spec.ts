import { TestBed } from '@angular/core/testing';

import { DirectPolicyServiceService } from './direct-policy-service.service';

describe('DirectPolicyServiceService', () => {
  let service: DirectPolicyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectPolicyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
