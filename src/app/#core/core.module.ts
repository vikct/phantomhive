import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  TranslateHttpLoader,
  provideTranslateHttpLoader,
} from '@ngx-translate/http-loader';
import { SingleSignOnModule } from './auth/single-sign-on/single-sign-on.module';
import { LayoutModule } from './layout/layout.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

@NgModule({
  imports: [
    SingleSignOnModule,
    LayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
      },
      defaultLanguage: 'en',
    }),
  ],
  providers: [
    provideTranslateHttpLoader(),
    provideAnimations(),
    NG_EVENT_PLUGINS,
  ],
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
