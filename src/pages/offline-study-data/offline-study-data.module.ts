import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineStudyDataPage } from './offline-study-data';

@NgModule({
  declarations: [
    OfflineStudyDataPage,
  ],
  imports: [
    IonicPageModule.forChild(OfflineStudyDataPage),
  ],
})
export class OfflineStudyDataPageModule {}
