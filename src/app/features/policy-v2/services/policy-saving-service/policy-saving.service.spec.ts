import { TestBed } from '@angular/core/testing';

import { PolicySavingService } from './policy-saving.service';

describe('PolicySavingService', () => {
  let service: PolicySavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicySavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
