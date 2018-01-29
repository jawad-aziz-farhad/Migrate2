import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditTitlePage } from './edit-title';

@NgModule({
  declarations: [
    EditTitlePage,
  ],
  imports: [
    IonicPageModule.forChild(EditTitlePage),
  ],
})
export class EditTitlePageModule {}
