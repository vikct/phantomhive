import { NgModule } from '@angular/core';
import { provideTaiga, TuiRoot } from '@taiga-ui/core';

@NgModule({
  imports: [TuiRoot],
  providers: [provideTaiga()],
  exports: [TuiRoot],
})
export class LayoutModule {}
