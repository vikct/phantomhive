import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { GoogleSsoButtonComponent } from './components/google-sso-button.component';
import { environment } from '../../../../environments/environment';

@NgModule({
  declarations: [GoogleSsoButtonComponent],
  imports: [CommonModule, GoogleSigninButtonModule],
  exports: [GoogleSsoButtonComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
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
