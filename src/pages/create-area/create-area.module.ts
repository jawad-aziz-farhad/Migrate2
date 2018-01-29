import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAreaPage } from './create-area';

@NgModule({
  declarations: [
    CreateAreaPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateAreaPage),
  ],
})
export class CreateAreaPageModule {}
