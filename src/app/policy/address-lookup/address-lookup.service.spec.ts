import { TestBed } from '@angular/core/testing';

import { AddressLookupService } from './address-lookup.service';

describe('AddressLookupService', () => {
  let service: AddressLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
