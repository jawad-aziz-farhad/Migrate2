import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoundSummaryPage } from './round-summary';

@NgModule({
  declarations: [
    RoundSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(RoundSummaryPage),
  ],
})
export class RoundSummaryPageModule {}
