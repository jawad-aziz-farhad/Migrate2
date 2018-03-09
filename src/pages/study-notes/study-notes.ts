import { Component  } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ParseDataProvider } from '../../providers';
/**
 * Generated class for the StudyNotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-study-notes',
  templateUrl: 'study-notes.html',
})
export class StudyNotesPage {
 
  public notes: any;

  constructor(public navCtrl: NavController,
              public parseData: ParseDataProvider) {
    this.initView();
  }

  initView(){
    this.notes = '';    
  }

  /* ADDING NOTES FOR STUDY */
  add_Notes(){
    this.parseData.getData().setNotes(this.notes);
    this.parseData.setData(this.parseData.getData());
    this.navCtrl.pop();
  }
  
}
