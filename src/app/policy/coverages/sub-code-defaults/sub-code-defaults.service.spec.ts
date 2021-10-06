import { TestBed } from '@angular/core/testing';

import { SubCodeDefaultsService } from './sub-code-defaults.service';

describe('SubCodeDefaultsService', () => {
  let service: SubCodeDefaultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubCodeDefaultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
