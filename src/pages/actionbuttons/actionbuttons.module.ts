import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActionButtons } from './actionbuttons';

@NgModule({
  declarations: [
    ActionButtons,
  ],
  imports: [
    IonicPageModule.forChild(ActionButtons),
  ],
})
export class ActionbuttonsPageModule {}
