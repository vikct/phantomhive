import { Component, inject } from '@angular/core';
import { FacebookSsoService } from './facebook-sso.service';
import { SingleSignOnService } from '../single-sign-on.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-facebook-sso-button',
  imports: [TuiButton],
  template: `
    <div class="facebook-btn-wrapper">
      <button
        tuiIconButton
        appearance="secondary"
        size="m"
        [style.border-radius.%]="50"
        (click)="login()"
        class="facebook-btn"
        title="Sign in with Facebook"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
        >
          <path
            fill="#1877F2"
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        </svg>
      </button>
    </div>
  `,
  standalone: true,
  styles: [
    `
      .facebook-btn-wrapper {
        display: block;
      }
    `,
  ],
})
export class FacebookSsoButtonComponent {
  private facebookSsoService = inject(FacebookSsoService);
  private ssoService = inject(SingleSignOnService);

  async login() {
    this.ssoService.ssoError.set(null);
    try {
      const result = (await this.facebookSsoService.login()) as any;
      if (result?.error === 'auth/account-exists-with-different-credential') {
        this.ssoService.setPendingCredential(result.credential);
        this.ssoService.ssoError.set('LOGIN.LINK_INSTRUCTION');
      }
    } catch (err) {
      // General errors handled by service/component if needed
    }
  }
}
