import { FactoryProvider } from '@angular/core';

import { OKTA_CONFIG, OktaAuthService } from '@okta/okta-angular';
import { ConfigService } from '../config/config.service';

export function oktaConfigFactory(configService: ConfigService) {
  let oktaConfiguration = {
    clientId: configService.oktaClientId,
    issuer: configService.oktaIssuer,
    redirectUri: configService.oktaRedirectUri,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    postLogoutRedirectUri: configService.oktaPostLogoutRedirectUri,
  };

  return oktaConfiguration;
}

export const OktaConfigProvider: FactoryProvider = {
  provide: OKTA_CONFIG,
  useFactory: oktaConfigFactory,
  deps: [ConfigService],
};
