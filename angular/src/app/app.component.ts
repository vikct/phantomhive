import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreService } from '@core/core.service';
import { AppLayoutComponent } from '@core/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLayoutComponent],
  template: `
    <app-layout>
      <router-outlet />
    </app-layout>
  `,
})
export class AppComponent {
  title = 'phantomhive';
  private core = inject(CoreService);
}
