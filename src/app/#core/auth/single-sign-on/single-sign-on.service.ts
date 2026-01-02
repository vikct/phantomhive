import { Injectable, inject, signal } from '@angular/core';
import { GoogleSsoService } from './google/google-sso.service';
import { GithubSsoService } from './github/github-sso.service';
import { Observable, merge, distinctUntilChanged } from 'rxjs';
import {
  Auth,
  AuthCredential,
  linkWithCredential,
  User,
  authState,
} from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SingleSignOnService {
  private auth = inject(Auth);
  private google = inject(GoogleSsoService);
  private github = inject(GithubSsoService);

  readonly ssoError = signal<string | null>(null);
  private _pendingCredential: AuthCredential | null = null;

  constructor() {
    authState(this.auth)
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        if (user && this._pendingCredential) {
          console.log(
            'SsoService: Auto-linking detected user and pending credential...'
          );
          this.linkWithPending(user);
        }
      });
  }

  readonly user$: Observable<string | null> = merge(
    this.google.appUser$,
    this.github.appUser$
  ).pipe(distinctUntilChanged()) as Observable<string | null>;

  setPendingCredential(credential: AuthCredential): void {
    this._pendingCredential = credential;
    console.log('SsoService: Pending credential set for linking.');
  }

  get hasPendingCredential(): boolean {
    return !!this._pendingCredential;
  }

  async linkWithPending(user: User): Promise<void> {
    if (!this._pendingCredential) return;

    try {
      await linkWithCredential(user, this._pendingCredential);
      this._pendingCredential = null;
      console.log('SsoService: Accounts linked successfully!');
    } catch (err) {
      console.error('SsoService: Failed to link accounts', err);
      throw err;
    }
  }

  async logout(): Promise<void> {
    // Logout from all providers
    await Promise.all([this.google.logout(), this.github.logout()]);
    this._pendingCredential = null;
  }
}
