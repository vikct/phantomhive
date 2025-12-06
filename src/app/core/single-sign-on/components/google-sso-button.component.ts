import { Component } from '@angular/core';

@Component({
  selector: 'app-google-sso-button',
  template: `
    <div class="google-btn-wrapper">
      <asl-google-signin-button
        type="standard"
        size="large"
      ></asl-google-signin-button>
    </div>
  `,
  standalone: false,
  styles: [
    `
      // .google-btn-wrapper {
      //   display: flex;
      //   justify-content: center;
      //   width: 100%;
      //   margin-top: 1rem;
      // }
    `,
  ],
})
export class GoogleSsoButtonComponent {}
