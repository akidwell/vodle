import { TestBed } from '@angular/core/testing';

import { NotifyOnSave } from './notify-on-save.service';

describe('NotifyOnSave.Service.TsService', () => {
  let service: NotifyOnSave;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyOnSave);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
