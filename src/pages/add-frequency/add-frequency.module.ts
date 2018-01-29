import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFrequencyPage } from './add-frequency';

@NgModule({
  declarations: [
    AddFrequencyPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFrequencyPage),
  ],
})
export class AddFrequencyPageModule {}
