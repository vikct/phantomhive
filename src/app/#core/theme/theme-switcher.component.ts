import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';
import { TUI_DARK_MODE, TUI_DARK_MODE_KEY, TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, TuiButton],
  template: `
    <button
      tuiIconButton
      type="button"
      [appearance]="appearance()"
      [size]="size()"
      [style.border-radius.%]="50"
      (click)="darkMode.set(!darkMode())"
      [title]="darkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    >
      <!-- Sun Icon (for Light Mode, shown when Dark Mode is ACTIVE) -->
      <!-- Wait, usually Sun means "Switch TO Light" or "Is currently Light"? -->
      <!-- Let's follow standard: Show Moon when Light (to switch to Dark), Show Sun when Dark (to switch to Light) -->

      <svg
        *ngIf="darkMode()"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="24"
        height="24"
      >
        <!-- Sun Icon -->
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>

      <svg
        *ngIf="!darkMode()"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="24"
        height="24"
      >
        <!-- Moon Icon -->
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class ThemeSwitcherComponent {
  private readonly key = inject(TUI_DARK_MODE_KEY);
  private readonly storage = inject(WA_LOCAL_STORAGE);
  private readonly media = inject(WA_WINDOW).matchMedia(
    '(prefers-color-scheme: dark)'
  );

  readonly appearance = input('action');
  readonly size = input<'s' | 'm' | 'l'>('m');

  protected readonly darkMode = inject(TUI_DARK_MODE);

  protected reset(): void {
    this.darkMode.set(this.media.matches);
    this.storage.removeItem(this.key);
  }
}
