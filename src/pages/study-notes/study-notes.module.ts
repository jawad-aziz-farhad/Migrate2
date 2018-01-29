import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudyNotesPage } from './study-notes';

@NgModule({
  declarations: [
    StudyNotesPage,
  ],
  imports: [
    IonicPageModule.forChild(StudyNotesPage),
  ],
})
export class StudyNotesPageModule {}
