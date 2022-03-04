import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
fetch('./assets/config/config.json').then(async res => {
  const config = await res.json();
  const authConfig = {
    "issuer": config.oktaIssuer,
    "clientId": config.oktaClientId,
    "scopes": config.oktaScopes,
    "redirectUri": config.oktaRedirectUri,
    "postLogoutRedirectUri": config.oktaPostLogoutRedirectUri,
    "pkce": true,
  }
  platformBrowserDynamic([
    { provide: OKTA_CONFIG, useValue: {oktaAuth: new OktaAuth(authConfig)}}
  ]).bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
