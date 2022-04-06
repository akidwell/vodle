import { TestBed } from '@angular/core/testing';

import { UnderlyingCoverageService } from './underlying-coverage.service';

describe('NotifyOnSave.Service.TsService', () => {
  let service: UnderlyingCoverageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnderlyingCoverageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
