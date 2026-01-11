import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationService } from '@core/i18n/app-translation.service';
import {
  TuiButton,
  TuiDataList,
  TuiFlagPipe,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiButtonSelect } from '@taiga-ui/kit';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe,
    TuiButton,
    TuiButtonSelect,
    TuiDataList,
    TuiFlagPipe,
    TuiTextfield,
  ],
  template: `
    <div class="switcher-wrapper">
      <button
        type="button"
        tuiButtonSelect
        tuiIconButton
        appearance="flat"
        size="s"
        [iconStart]="'languages'"
        [formControl]="languageControl"
        class="lang-switcher"
      >
        <span class="lang-code">{{ languageControl.value | uppercase }}</span>

        <tui-data-list *tuiTextfieldDropdown>
          <button
            *ngFor="let lang of languages"
            tuiOption
            new
            [value]="lang"
            (click)="setLang(lang)"
            class="lang-option"
          >
            <img alt="" class="t-flag" [src]="getFlag(lang) | tuiFlag" />
            {{ getLabel(lang) }}
          </button>
        </tui-data-list>
      </button>

      <!-- Manual Badge (floating on top of button) -->
      <img alt="" class="flag-badge" [src]="activeFlag | tuiFlag" />
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .content {
        /* Ensure badge doesn't block clicks if needed */
        pointer-events: none;
      }
      .content > * {
        pointer-events: auto;
      }
      .lang-switcher {
        --tui-padding: 0;
      }
      .lang-code {
        font-weight: 600;
        margin-right: 0.5rem;
      }
      .t-flag {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        margin-right: 0.5rem;
        box-shadow: inset 0 0 0 1px var(--tui-border-normal);
      }
      .switcher-wrapper {
        position: relative;
        display: inline-flex;
        vertical-align: middle;
      }
      .flag-badge {
        position: absolute;
        bottom: -4px;
        right: -4px;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2),
          inset 0 0 0 1px rgba(255, 255, 255, 0.3);
        pointer-events: none; /* Let clicks pass through to button */
        z-index: 10;
        background: var(--tui-base-01); /* Fallback background, matches theme */
      }
      .lang-option {
        display: flex;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  languageControl = new FormControl('en');
  readonly languages = ['en', 'zh', 'ja'];

  private flagMap: Record<string, string> = {
    en: 'gb',
    zh: 'cn',
    ja: 'jp',
  };

  constructor(private translationService: AppTranslationService) {
    this.languageControl.setValue(this.translationService.currentLang);
    this.languageControl.valueChanges.subscribe((val) => {
      if (val) this.translationService.changeLanguage(val);
    });
  }

  get activeFlag(): string {
    return this.getFlag(this.languageControl.value || 'en');
  }

  getFlag(lang: string): string {
    return this.flagMap[lang] || 'gb';
  }

  getLabel(lang: string): string {
    switch (lang) {
      case 'zh':
        return '中文';
      case 'ja':
        return '日本語';
      default:
        return 'English';
    }
  }

  setLang(lang: string) {
    this.languageControl.setValue(lang);
  }
}
