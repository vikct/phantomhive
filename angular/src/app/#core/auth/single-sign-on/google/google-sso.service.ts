import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  authState,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GoogleSsoService {
  private auth = inject(Auth);

  get authState$(): Observable<User | null> {
    return authState(this.auth);
  }

  get appUser$(): Observable<string | null> {
    return this.authState$.pipe(
      map((user) => (user ? user.displayName || user.email || 'User' : null))
    );
  }

  async login(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
    } catch (err) {
      console.error('Google login failed', err);
      throw err;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Signed out from Firebase via GoogleService');
    } catch (err) {
      console.error('Firebase signout failed', err);
      throw err;
    }
  }
}
