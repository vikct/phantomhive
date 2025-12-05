import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Hardcoded for now as requested
  private readonly MOCK_USER = 'R!Ciel';
  private readonly MOCK_PASS = 'R!Ciel';

  currentUser = signal<string | null>(null);

  constructor(
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    // Check localStorage for session persistence
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(storedUser);
    }

    // Subscribe to social auth state
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      console.log('User logged in via Google:', user);
      if (user) {
        this.currentUser.set(user.name);
        localStorage.setItem('currentUser', user.name);
        this.router.navigate(['/']);
      }
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
    // Attempt to sign out specific to social auth if needed, but for now generic cleanup
    this.socialAuthService
      .signOut()
      .catch((err) => console.log('Social signout not needed or failed', err));

    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
