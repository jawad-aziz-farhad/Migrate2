import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerExpiredPage } from './timer-expired';

@NgModule({
  declarations: [
    TimerExpiredPage,
  ],
  imports: [
    IonicPageModule.forChild(TimerExpiredPage),
  ],
})
export class TimerExpiredPageModule {}
