import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OktaAuthModule, OktaAuthService, OKTA_CONFIG } from '@okta/okta-angular';

import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let mockOktaService: OktaAuthService;
  let httpTestingController: HttpTestingController;

  const oktaConfig = {
    issuer: 'https://not-real.okta.com',
    clientId: 'fake-client-id',
    redirectUri: 'http://localhost:4200'
  };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OktaAuthModule],
      declarations: [ NavigationComponent],
      providers: [OktaAuthService,  { provide: OKTA_CONFIG, useValue: oktaConfig }]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    mockOktaService = TestBed.inject(OktaAuthService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have six menu items', () => {
    const fixture = TestBed.createComponent(NavigationComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('a')).length).toBe(4);
  });

});
