import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudyOptionsPage } from './study-options';

@NgModule({
  declarations: [
    StudyOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(StudyOptionsPage),
  ],
})
export class StudyOptionsPageModule {}
