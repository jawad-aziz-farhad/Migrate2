import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudyItemsPage } from './study-items';

@NgModule({
  declarations: [
    StudyItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(StudyItemsPage),
  ],
})
export class StudyItemsPageModule {}
