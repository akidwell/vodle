import { TestBed } from '@angular/core/testing';

import { NavigationConfirmationService } from './navigation-confirmation.service';

describe('NavigationConfirmationService', () => {
  let service: NavigationConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
