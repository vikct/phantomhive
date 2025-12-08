import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  TranslateHttpLoader,
  provideTranslateHttpLoader,
} from '@ngx-translate/http-loader';
import { SingleSignOnModule } from './auth/single-sign-on/single-sign-on.module';

// ... imports

import { LayoutModule } from './layout/layout.module';

import { SocialLoginModule } from '@abacritt/angularx-social-login';

@NgModule({
  imports: [
    SingleSignOnModule,
    SocialLoginModule,
    LayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
      },
      defaultLanguage: 'en',
    }),
  ],
  providers: [provideTranslateHttpLoader()],
  exports: [SingleSignOnModule, TranslateModule, LayoutModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
