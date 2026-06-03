import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { SingleSignOnService } from './single-sign-on/single-sign-on.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';

interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  currentUser = signal<string | null>(null);
  token = signal<string | null>(null);

  private ssoService = inject(SingleSignOnService);
  private auth = inject(Auth);
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {
    // Check localStorage for session persistence
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.currentUser.set(storedUser);
      this.token.set(storedToken);
    }

    // Subscribe to Firebase Auth state changes for SSO logins
    authState(this.auth).subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const provider = firebaseUser.providerData[0]?.providerId || 'google';
          this.exchangeSsoToken(idToken, provider);
        } catch (err) {
          console.error('Failed to get Firebase ID token:', err);
        }
      }
    });
  }

  login(username: string, pass: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, {
      username,
      password: pass,
    }).pipe(
      tap((res) => {
        this.currentUser.set(res.username);
        this.token.set(res.token);
        localStorage.setItem('currentUser', res.username);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      })
    );
  }

  private exchangeSsoToken(idToken: string, provider: string): void {
    this.http.post<AuthResponse>(`${this.API_URL}/sso-login`, {
      idToken,
      provider,
    }).subscribe({
      next: (res) => {
        this.currentUser.set(res.username);
        this.token.set(res.token);
        localStorage.setItem('currentUser', res.username);
        localStorage.setItem('token', res.token);
        if (this.router.url.includes('login')) {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Backend SSO login failed:', err);
      }
    });
  }

  logout(): void {
    // Attempt sign out from SSO provider(s)
    this.ssoService.logout().catch(() => {});

    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null && this.token() !== null;
  }
}
