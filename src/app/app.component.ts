import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreService } from '@core/core.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'phantomhive';
  private core = inject(CoreService);
}
