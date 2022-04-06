import { TestBed } from '@angular/core/testing';

import { UpdatePolicyChild } from './update-child.service';

describe('NotifyOnSave.Service.TsService', () => {
  let service: UpdatePolicyChild;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePolicyChild);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
