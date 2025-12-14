import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SsoService } from './single-sign-on/sso.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Hardcoded for now as requested
  private readonly MOCK_USER = 'R!Ciel';
  private readonly MOCK_PASS = 'R!Ciel';

  currentUser = signal<string | null>(null);

  private ssoService = inject(SsoService);
  private router = inject(Router);

  constructor() {
    // Check localStorage for session persistence
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(storedUser);
    }

    // Subscribe to SSO auth state (aggregated)
    this.ssoService.user$.subscribe((name) => {
      console.log('SSO auth state changed:', name);
      if (name) {
        this.currentUser.set(name);
        localStorage.setItem('currentUser', name);

        if (this.router.url.includes('login')) {
          this.router.navigate(['/']);
        }
      }
      // Note: We don't auto-clear on null to preserve the mock user session if it exists,
      // matching previous mixed-auth logic.
    });
  }

  login(username: string, pass: string): boolean {
    if (username === this.MOCK_USER && pass === this.MOCK_PASS) {
      this.currentUser.set(username);
      localStorage.setItem('currentUser', username);
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  logout(): void {
    // Attempt sign out from SSO provider(s)
    this.ssoService.logout().catch(() => {});

    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
