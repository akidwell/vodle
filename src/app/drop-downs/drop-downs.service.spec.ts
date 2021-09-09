import { TestBed } from '@angular/core/testing';

import { DropDownsService } from './drop-downs.service';

describe('DropDownsService', () => {
  let service: DropDownsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropDownsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
