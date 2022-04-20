import { TestBed } from '@angular/core/testing';

import { MessageDialogService } from './message-dialog-service';

describe('ErrorDialogService', () => {
  let service: MessageDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
