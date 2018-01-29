import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { NewTimerComponent } from '../../components/new-timer/new-timer';
import { Time , AlertProvider , ParseDataProvider, ParserProvider , StudyStatusProvider } from '../../providers';
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
 
  @ViewChild(TimerComponent) timer: TimerComponent;
  
  private study_photo: boolean; 
  public roundTime: number = 0;
  public notes: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams , 
              public time: Time,
              public alertProvider: AlertProvider,
              public parseData: ParseDataProvider,
              public parser: ParserProvider,
              public studyStatus: StudyStatusProvider) {
      //this.roundTime = this.time.getTime();          
      this.notes = '';          
  }

  ionViewDidLoad() {
    this.study_photo = false;
    this.study_photo = this.navParams.get('photo');
  }

  ionViewWillEnter() {
    //this.roundTime = this.time.getTime();
    this.timer.resumeTimer();
  }

  addNotes(){

      if(this.notes == '')
        this.alertProvider.showAlert(NOTES_ALERT_TITLE, NOTES_ALERT_MESSAGE);
      
      else{
          this._parseTime();
          this._parseData(this.notes);

          if(this.study_photo)
            this.navCtrl.push(StudyPhotoPage);
          else{

            this.parseData.setDataArray(this.parseData.getData());
            this.parseData.clearData();

            if(this.timer.hasFinished() || this.timer.getRemainingTime() <= 0){
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

  /* PARSING ROUND TIME TO NEXT PAGE */
  _parseTime(){
    console.log('REMAINING TIME AT STUDY NOTES PAGE: '+ this.timer.getRemainingTime());
    this.timer.stopTimer();
    this.timer.pauseTimer();
    this.time.setTime(this.timer.getRemainingTime());
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
        this.timer.killTimer();
        this.studyStatus.setStatus(false);
        this.navCtrl.popToRoot();
      }
    }
  }

}
