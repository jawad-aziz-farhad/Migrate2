import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmitDataDialogPage } from './submit-data-dialog';

@NgModule({
  declarations: [
    SubmitDataDialogPage,
  ],
  imports: [
    IonicPageModule.forChild(SubmitDataDialogPage),
  ],
})
export class SubmitDataDialogPageModule {}
