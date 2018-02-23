import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Time , AlertProvider , ParseDataProvider, ParserProvider } from '../../providers';
import { NOTES_ALERT_TITLE , NOTES_ALERT_MESSAGE } from '../../config/config'; 
import { StudyPhotoPage } from '../study-photo/study-photo';
import { StudyItemsPage } from '../study-items/study-items';
import { Rounds } from '../../models/index';
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
 
  private study_photo: boolean; 
  public roundTime: number = 0;
  public notes: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams , 
              public time: Time,
              public alertProvider: AlertProvider,
              public parseData: ParseDataProvider,
              public parser: ParserProvider) {
    this.initView();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
  }

  initView(){
    this.notes = '';    
    this.study_photo = false;
    this.study_photo = this.navParams.get('photo');
  }

  addNotes(){

      if(this.notes == '')
        this.alertProvider.showAlert(NOTES_ALERT_TITLE, NOTES_ALERT_MESSAGE);
      
      else{
          this._parseData(this.notes);

          if(this.study_photo)
            this.navCtrl.push(StudyPhotoPage);
          else{

            this.parseData.setDataArray(this.parseData.getData());
            this.parseData.clearData();

            if(this.time.ticks <= 0){
              this.parser.getRounds().setRoundData(this.parseData.getDataArray());
              this.parser.getRounds().setRoundEndTime(new Date().getTime());
              this.parser.setRounds(this.parser.getRounds());
              this.parser.geAllData().setRoundData(this.parser.getRounds());
              this.parser.geAllData().setStudyEndTime(new Date().getTime());

              /* CLEARING STUDY DATA OBJECT AND ARRAY FOR NEXT ENTRIES AND NEXT ROUND*/
              this.parseData.clearDataArray();
              this.parser.clearRounds()
              this.navCtrl.push(StudyItemsPage);
            }
            else
              this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 3)));
           
          }
      }  
  }

  _parseData(notes: string) {    
    this.parseData.getData().setNotes(notes);
    this.parseData.setData(this.parseData.getData());
    console.log("STUDY DATA AT ENTER NOTES PAGE: " + JSON.stringify(this.parseData.getData()));
  }
  
  /* WHEN USER CANCEL THE STUDY WE WILL KILL TIMER AND NAVIGATE USER TO ROOT PAGE */
  onCancelStudy(event){
    if(event){
      {
        this.time.destroyTimer();
        this.navCtrl.popToRoot();
      }
    }
  }

}
