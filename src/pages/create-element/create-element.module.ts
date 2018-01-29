import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateElementPage } from './create-element';

@NgModule({
  declarations: [
    CreateElementPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateElementPage),
  ],
})
export class CreateElementPageModule {}
