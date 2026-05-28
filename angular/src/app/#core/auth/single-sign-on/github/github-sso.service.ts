import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
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
export class GithubSsoService {
  private auth = inject(Auth);

  get authState$(): Observable<User | null> {
    return authState(this.auth);
  }

  get appUser$(): Observable<string | null> {
    return this.authState$.pipe(
      map((user) => (user ? user.displayName || user.email || 'User' : null))
    );
  }

  async login(): Promise<any> {
    try {
      const provider = new GithubAuthProvider();
      return await signInWithPopup(this.auth, provider);
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        console.error(
          'GitHub login failed: An account already exists with the same email but a different login provider (e.g. Google).'
        );
        // Return the credential so it can be used for linking later
        return {
          error: err.code,
          credential: GithubAuthProvider.credentialFromError(err),
        };
      } else {
        console.error('GitHub login failed', err);
        throw err;
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Signed out from Firebase via GithubService');
    } catch (err) {
      console.error('Firebase signout failed', err);
      throw err;
    }
  }
}
