import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [
      () =>
        inject(AuthService).isAuthenticated() ||
        inject(AuthService).logout() ||
        false,
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '**', redirectTo: '' },
];
