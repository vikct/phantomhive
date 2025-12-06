import { NgModule } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

@NgModule({
  imports: [TuiRoot],
  providers: [NG_EVENT_PLUGINS],
  exports: [TuiRoot],
})
export class ThemeModule {}
