import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreService } from '@core/core.service';

import { TuiRoot } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  template: `<tui-root><router-outlet></router-outlet></tui-root>`,
  styles: ``,
})
export class AppComponent {
  title = 'phantomhive';
  private core = inject(CoreService);
}
