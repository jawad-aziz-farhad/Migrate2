import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoutModalPage } from './logout-modal';

@NgModule({
  declarations: [
    LogoutModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LogoutModalPage),
  ],
})
export class LogoutModalPageModule {}
