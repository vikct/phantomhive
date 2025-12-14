import { Component } from '@angular/core';

import { AppTranslationService } from '@core/i18n/app-translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [],
  template: `
    <div class="language-switcher">
      <button
        type="button"
        [class.active]="currentLang === 'en'"
        (click)="switchLanguage('en')"
      >
        EN
      </button>
      <span class="divider">|</span>
      <button
        type="button"
        [class.active]="currentLang === 'zh'"
        (click)="switchLanguage('zh')"
      >
        中文
      </button>
      <span class="divider">|</span>
      <button
        type="button"
        [class.active]="currentLang === 'ja'"
        (click)="switchLanguage('ja')"
      >
        日本語
      </button>
    </div>
  `,
  styles: [
    `
      .language-switcher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;

        button {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          padding: 0.2rem 0.5rem;
          transition: color 0.3s;

          &.active,
          &:hover {
            color: #fff;
            font-weight: bold;
          }
        }

        .divider {
          color: #444;
        }
      }
    `,
  ],
})
export class LanguageSwitcherComponent {
  constructor(private translationService: AppTranslationService) {}

  get currentLang(): string {
    return this.translationService.currentLang;
  }

  switchLanguage(lang: string) {
    this.translationService.changeLanguage(lang);
  }
}
