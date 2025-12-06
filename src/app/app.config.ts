import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SingleSignOnModule } from './core/modules/single-sign-on/single-sign-on.module';

import { SocialLoginModule } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(SingleSignOnModule, SocialLoginModule),
  ],
};
