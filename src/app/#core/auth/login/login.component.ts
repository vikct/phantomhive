import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '@core/auth/auth.service';
import { SingleSignOnService } from '@core/auth/single-sign-on/single-sign-on.service';
import { FacebookSsoButtonComponent } from '@core/auth/single-sign-on/facebook/facebook-sso-button.component';
import { ThemeSwitcherComponent } from '@core/theme/theme-switcher.component';
import { GoogleSsoButtonComponent } from '@core/auth/single-sign-on/google/google-sso-button.component';
import { GithubSsoButtonComponent } from '@core/auth/single-sign-on/github/github-sso-button.component';
import { LanguageSwitcherComponent } from '@core/i18n/language-switcher.component';

import {
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiNotification,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GoogleSsoButtonComponent,
    GithubSsoButtonComponent,
    FacebookSsoButtonComponent,
    TranslateModule,
    LanguageSwitcherComponent,
    ThemeSwitcherComponent,

    // Taiga UI
    TuiAppearance,
    TuiButton,
    TuiError,
    TuiNotification,
    TuiTextfield,
    TuiTitle,

    TuiCardLarge,
    TuiForm,
    TuiHeader,

    TuiFieldErrorPipe,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public ssoService: SingleSignOnService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // If already logged in, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const success = this.authService.login(username, password);

      if (!success) {
        this.error = 'Invalid username or password';
        this.loginForm.get('password')?.reset();
      } else {
        this.error = null;
      }
    }
  }
}
