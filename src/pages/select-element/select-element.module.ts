import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectElementPage } from './select-element';

@NgModule({
  declarations: [
    SelectElementPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectElementPage),
  ],
})
export class SelectElementPageModule {}
