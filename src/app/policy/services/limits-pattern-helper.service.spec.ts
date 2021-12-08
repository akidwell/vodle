import { TestBed } from '@angular/core/testing';

import { LimitsPatternHelperService } from './limits-pattern-helper.service';

describe('LimitsPatternHelperService', () => {
  let service: LimitsPatternHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LimitsPatternHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
