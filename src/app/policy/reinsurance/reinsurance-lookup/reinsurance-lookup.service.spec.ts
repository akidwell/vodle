import { TestBed } from '@angular/core/testing';

import { ReinsuranceLookupService } from './reinsurance-lookup.service';

describe('ReinsuranceLookupService', () => {
  let service: ReinsuranceLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReinsuranceLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
