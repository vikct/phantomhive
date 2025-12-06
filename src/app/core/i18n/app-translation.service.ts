import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AppTranslationService {
  constructor(private translate: TranslateService) {
    this.init();
  }

  private init() {
    this.translate.addLangs(['en', 'zh', 'ja']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
