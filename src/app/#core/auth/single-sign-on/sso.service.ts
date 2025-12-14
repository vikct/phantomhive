import { Injectable, inject } from '@angular/core';
import { GoogleSsoService } from './google/google-sso.service';
import { Observable, merge } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SsoService {
  private google = inject(GoogleSsoService);

  // Future: merge(this.google.appUser$, this.facebook.appUser$, ...)
  // For now, it's just Google, but structure is ready for more.
  readonly user$: Observable<string | null> = this.google.appUser$;

  async logout(): Promise<void> {
    // Logout from all providers
    await this.google.logout();
  }
}
