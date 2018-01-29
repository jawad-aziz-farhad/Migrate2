import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudyPhotoPage } from './study-photo';

@NgModule({
  declarations: [
    StudyPhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(StudyPhotoPage),
  ],
})
export class StudyPhotoPageModule {}
