import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '@env/environment';

export const provideFirebaseConfig = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideFirebaseApp(() => {
      const config = (environment as any).firebaseConfig;
      return initializeApp(config);
    }),
    provideAuth(() => {
      return getAuth();
    }),
  ]);
};
