import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import * as allIcons from 'angular-feather/icons';

const icons = allIcons as { [key: string]: any };

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}
