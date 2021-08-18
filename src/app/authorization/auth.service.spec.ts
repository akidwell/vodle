import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OktaAuthService } from '@okta/okta-angular';
import { ConfigService } from '../config/config.service';
import { UserAuth } from './user-auth';

describe('AuthService', () => {
  let service: AuthService;
  let mockJwtService: JwtHelperService;
  let httpTestingController: HttpTestingController;
  let mockOktaService;
  let mockConfigService;
  let mockAuthService;


  beforeEach(() => {
    mockOktaService = jasmine.createSpyObj(['getAccessToken'])
    mockOktaService.getAccessToken.and.returnValue('');
    mockConfigService = jasmine.createSpyObj(['apiBaseUrl'])
    mockConfigService.apiBaseUrl.and.returnValue('');
    mockAuthService = jasmine.createSpyObj(['bearerToken'])
    mockAuthService.bearerToken.and.returnValue('');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, {provide: UserAuth, useValue: mockAuthService}, {provide: JwtHelperService, useValue: mockJwtService }, {provide: OktaAuthService, useValue: mockOktaService },  { provide: ConfigService, useValue: mockConfigService }]
    });
    service = TestBed.inject(AuthService);

    httpTestingController = TestBed.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
