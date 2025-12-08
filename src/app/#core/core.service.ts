import { Injectable, inject } from '@angular/core';
import { AppTranslationService } from './i18n/app-translation.service';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  // Inject services here to ensure they are initialized on app startup
  private translationService = inject(AppTranslationService);

  constructor() {
    // Add any additional core initialization logic here
  }
}
