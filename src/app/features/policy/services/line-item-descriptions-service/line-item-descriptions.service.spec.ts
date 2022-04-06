import { TestBed } from '@angular/core/testing';

import { LineItemDescriptionsService } from './line-item-descriptions.service';

describe('LineItemDescriptionsService', () => {
  let service: LineItemDescriptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineItemDescriptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
