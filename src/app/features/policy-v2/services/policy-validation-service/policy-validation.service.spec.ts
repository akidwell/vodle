import { TestBed } from '@angular/core/testing';

import { PolicyValidationService } from './policy-validation.service';

describe('PolicyValidationService', () => {
  let service: PolicyValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
