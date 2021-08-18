import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';


import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: AuthService;
  let httpTestingController: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: AuthService, useValue: mockAuthService }]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
