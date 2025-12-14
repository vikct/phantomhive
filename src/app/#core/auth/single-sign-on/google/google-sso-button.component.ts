import { Component, inject } from '@angular/core';
import { GoogleSsoService } from './google-sso.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-google-sso-button',
  imports: [TuiButton],
  template: `
    <div class="google-btn-wrapper">
      <button
        tuiButton
        appearance="secondary"
        size="m"
        size="m"
        (click)="login()"
        class="google-btn"
      >
        Sign in with Google
      </button>
    </div>
  `,
  standalone: true,
  styles: [
    `
      .google-btn-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 1rem;
      }
      .google-btn {
        width: 100%;
      }
    `,
  ],
})
export class GoogleSsoButtonComponent {
  private googleSsoService = inject(GoogleSsoService);

  login() {
    this.googleSsoService.login();
  }
}
