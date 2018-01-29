import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreaDetailPage } from './area-detail';

@NgModule({
  declarations: [
    AreaDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AreaDetailPage),
  ],
})
export class AreaDetailPageModule {}
