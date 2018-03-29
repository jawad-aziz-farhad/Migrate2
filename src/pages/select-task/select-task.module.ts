import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectTaskPage } from './select-task';

@NgModule({
  declarations: [
    SelectTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectTaskPage),
  ],
})
export class SelectTaskPageModule {}
