import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationSummaryPage } from './observation-summary';

@NgModule({
  declarations: [
    ObservationSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(ObservationSummaryPage),
  ],
})
export class ObservationSummaryPageModule {}
