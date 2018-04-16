import { Component , Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ParseDataProvider } from '../../providers';
import { StudyNotesPage } from '../../pages/study-notes/study-notes';
import { StudyPhotoPage } from '../../pages/study-photo/study-photo';
/**
 * Generated class for the ButtonsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'buttons',
  templateUrl: 'buttons.html'
})
export class ButtonsComponent {

  @Input() nextElement: any;
  @Output() goFor = new EventEmitter<String>();

  constructor(private parseData: ParseDataProvider,
              private navCtrl: NavController) {
  }


  /* ADDING NOTES FOR THE CURRENT OBSERVATION */
  addNotes(){
    this.navCtrl.push(StudyNotesPage);
  }
  /* ADDING PHOTO FOR THE CURRENT OBSERVATION */
  addPhoto(){
    this.navCtrl.push(StudyPhotoPage);
  }

  go(goFor: string){
    this.goFor.emit(goFor);
  }

}
