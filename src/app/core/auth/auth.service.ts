import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Hardcoded for now as requested
  private readonly MOCK_USER = 'R!Ciel';
  private readonly MOCK_PASS = 'R!Ciel';

  currentUser = signal<string | null>(null);

  constructor(private router: Router) {
    // Check localStorage for session persistence
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(storedUser);
    }
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
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
