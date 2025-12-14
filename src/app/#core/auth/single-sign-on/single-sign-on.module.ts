import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideFirebaseConfig } from '@core/auth/single-sign-on/google/firebase.config';
import { GoogleSsoButtonComponent } from './google/google-sso-button.component';

@NgModule({
  imports: [CommonModule, GoogleSsoButtonComponent],
  exports: [GoogleSsoButtonComponent],
  providers: [provideFirebaseConfig()],
})
export class SingleSignOnModule {}
