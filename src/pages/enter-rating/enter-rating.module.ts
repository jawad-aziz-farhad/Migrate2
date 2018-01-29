import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterRatingPage } from './enter-rating';

@NgModule({
  declarations: [
    EnterRatingPage,
  ],
  imports: [
    IonicPageModule.forChild(EnterRatingPage),
  ],
})
export class EnterRatingPageModule {}
