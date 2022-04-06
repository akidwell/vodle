import { Component, Directive, Input } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';

import { Location } from '@angular/common';
import { PolicyComponent } from './policy/policy.component';
import { ImportComponent } from './import/import.component';
import { ReportsComponent } from './core/components/reports/reports.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('AppComponent', () => {
  let router: Router;
  let location: Location;

  const oktaConfig = {
    issuer: 'https://not-real.okta.com',
    clientId: 'fake-client-id',
    redirectUri: 'http://localhost:4200'
  };

  @Component({
    selector: 'rsps-version',
    template: '<div id="version">1.0.0.0</div>'
  })
  class FakeVersionComponent {
    uiVersion: string = '';
    apiVersion: string = ''
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        HttpClientTestingModule,
        OktaAuthModule,
        RouterTestingModule.withRoutes([
          {path: 'home', component: HomeComponent},
          {path: 'search', component: SearchComponent},
          {path: 'policy', component: PolicyComponent},
          {path: 'import', component: ImportComponent},
          {path: 'reports', component: ReportsComponent}
        ])
      ],
      declarations: [
        AppComponent,
        FakeVersionComponent,
        RouterLinkDirectiveStub,
        NavigationComponent
      ],
      providers: [{provide: OKTA_CONFIG, useValue: oktaConfig}]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'RSPS'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('RSPS');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#header').textContent).toContain('RSPS');
  });

  it('should create version component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(fixture.debugElement.query(By.directive(FakeVersionComponent))).toBeTruthy();
  });

  it('should render version in footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.footer').textContent).toContain('1.0.0.0');
  });

  // it('should navigate to Home when selecting Home', fakeAsync(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();

  //   router = TestBed.inject(Router);
  //   location = TestBed.inject(Location);
  //   fixture.debugElement.queryAll(By.css('a'))[0].nativeElement.click();
  //   tick();
  //   expect(location.path()).toBe('/home');
  // }));

  // it('should navigate to Search when selecting Search', fakeAsync(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();

  //   router = TestBed.inject(Router);
  //   location = TestBed.inject(Location);
  //   fixture.debugElement.queryAll(By.css('a'))[1].nativeElement.click();
  //   tick();
  //   expect(location.path()).toBe('/search');
  // }));

  // it('should navigate to Policy when selecting Policy', fakeAsync(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();

  //   router = TestBed.inject(Router);
  //   location = TestBed.inject(Location);
  //   fixture.debugElement.queryAll(By.css('a'))[2].nativeElement.click();
  //   tick();
  //   expect(location.path()).toBe('/policy');
  // }));

  // it('should navigate to Reports when selecting Reports', fakeAsync(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();

  //   router = TestBed.inject(Router);
  //   location = TestBed.inject(Location);
  //   fixture.debugElement.queryAll(By.css('a'))[4].nativeElement.click();
  //   tick();
  //   expect(location.path()).toBe('/reports');
  // }));

  // it('should have six menu items', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   expect(fixture.debugElement.queryAll(By.css('a')).length).toBe(6);
  // });

});
