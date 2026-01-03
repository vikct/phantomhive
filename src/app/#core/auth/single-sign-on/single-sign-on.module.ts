import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideFirebaseConfig } from '@core/auth/single-sign-on/google/firebase.config';
import { GoogleSsoButtonComponent } from './google/google-sso-button.component';
import { GithubSsoButtonComponent } from './github/github-sso-button.component';
import { FacebookSsoButtonComponent } from './facebook/facebook-sso-button.component';

@NgModule({
  imports: [
    CommonModule,
    GoogleSsoButtonComponent,
    GithubSsoButtonComponent,
    FacebookSsoButtonComponent,
  ],
  exports: [
    GoogleSsoButtonComponent,
    GithubSsoButtonComponent,
    FacebookSsoButtonComponent,
  ],
  providers: [provideFirebaseConfig()],
})
export class SingleSignOnModule {}
