import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OKTA_CONFIG, OktaAuthModule, OktaAuthService } from '@okta/okta-angular';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let mockOktaService: OktaAuthService;
  let httpTestingController: HttpTestingController;
  let mockJwtService: JwtHelperService;
  
  const oktaConfig = {
    issuer: 'https://not-real.okta.com',
    clientId: 'fake-client-id',
    redirectUri: 'http://localhost:4200'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserComponent ],
      imports: [HttpClientTestingModule ],
      providers: [OktaAuthService,  { provide: OKTA_CONFIG, useValue: oktaConfig }, {provide: JwtHelperService, useValue: mockJwtService }]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    mockOktaService = TestBed.inject(OktaAuthService);

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
