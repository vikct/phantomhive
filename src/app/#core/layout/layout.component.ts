import { Component, inject } from '@angular/core';
import { TuiRoot, TUI_DARK_MODE } from '@taiga-ui/core';
import { AuthService } from '@core/auth/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [TuiRoot, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class AppLayoutComponent {
  protected authService = inject(AuthService);
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
