import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VersionInfoPage } from './version-info';

@NgModule({
  declarations: [
    VersionInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(VersionInfoPage),
  ],
})
export class VersionInfoPageModule {}
