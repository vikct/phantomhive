import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SOCIAL_AUTH_CONFIG,
} from '@abacritt/angularx-social-login';
import { GoogleSsoButtonComponent } from './components/google-sso-button.component';
import { environment } from '@env/environment';

@NgModule({
  declarations: [GoogleSsoButtonComponent],
  imports: [CommonModule, GoogleSigninButtonModule],
  exports: [GoogleSsoButtonComponent],
  providers: [
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
})
export class SingleSignOnModule {}
