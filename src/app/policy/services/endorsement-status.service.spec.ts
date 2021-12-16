import { TestBed } from '@angular/core/testing';

import { EndorsementStatusService } from './endorsement-status.service';

describe('endorsementStatusService', () => {
  let service: EndorsementStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndorsementStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
