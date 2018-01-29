import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { NewTimerComponent } from '../../components/new-timer/new-timer';
import { Time , OperationsProvider  , ParseDataProvider , ParserProvider, StudyStatusProvider } from '../../providers';
import { StudyPhotoPage } from '../study-photo/study-photo';
import { StudyNotesPage } from '../study-notes/study-notes';
import { StudyItemsPage } from '../study-items/study-items';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { SelectRolePage } from '../select-role/select-role';
import { Rounds } from '../../models/index';
/**
 * Generated class for the AddFrequencyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-frequency',
  templateUrl: 'add-frequency.html',
})
export class AddFrequencyPage {

  @ViewChild(TimerComponent) timer: TimerComponent;
  
  public roundTime: number = 0;
  public numbers: any;
  public frequency: any;

  constructor(public navCtrl: NavController, 
               public navParams: NavParams , 
               public time: Time,
               public operations: OperationsProvider,
               public modalCtrl: ModalController,
               public parseData: ParseDataProvider,
               public studyStatus: StudyStatusProvider,
               public parser: ParserProvider) {
      this.frequency = ''; 
   }
   
   ionViewDidLoad() {     
     this.numbers = ['0','1', '2', '3', '4', '5', '6' , '7','8', '9'];
     console.log('SelectElementPage');
   }

  ionViewWillEnter() {
    this.timer.resumeTimer();
  }

  
  /* CONCATINATING FREQUENCY WITH THE PREVIOUS ONE*/
  concatFrequency(num){
    this.frequency = this.frequency + num;
  } 

  /* REMOVING ENTERED FREQUENCY */ 
  removeFrequency(){
    var length = this.frequency.length - 1;
    this.frequency = this.frequency.slice(0, this.frequency.length -1 );
  }

  /* ADDING FREQUENCY TO THE ROUND DATA AND MOVING TO NEXT PAGE */
  addFrequency(){
    console.log('FREQUENCY IS: ' + this.frequency);
    this._parseTime();
    this.openModal();
  }

  /* PARSING ROUND TIME TO NEXT PAGE */
  _parseTime(){
    console.log('REMAINING TIME AT FREQUENCY PAGE: '+ this.timer.getRemainingTime());   
    this.timer.stopTimer();
    this.timer.pauseTimer()
    this.time.setTime(this.timer.getRemainingTime());
  }

  /* PARSING DATA */
  _parseData(frequency: number) {
    var observationTime = 0;
    if(this.parseData.getData().getRating() == 0)
      this.parseData.getData().setObservationTime("00:00");
    else { 
      observationTime = new Date().getTime() - this.parseData.getData().getObservationTime();
      var observation_Time = this.millisToMinutesAndSeconds(observationTime);
      this.parseData.getData().setObservationTime(observation_Time);
    }
    this.parseData.getData().setNotes(null);
    this.parseData.getData().setPhoto(null);
    this.parseData.getData().setFrequency(frequency);
    this.parseData.setData(this.parseData.getData());
    console.log("STUDY DATA AT FREQUENCY PAGE: \n" + JSON.stringify(this.parseData.getData()));
  } 

  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    if(minutes > 0)
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
    else
      return '00:' +(parseInt(seconds) < 10 ? '0' : '') + seconds;
  }
   
  /* OPENING MODAL FOR ADDING FREQUENCY */
  openModal() {
      let modal = this.modalCtrl.create('StudyOptionsPage', null, { cssClass: 'inset-modal' });        
      modal.onDidDismiss(data => {

              this._parseTime();
              this._parseData(this.frequency);
        
              /* IF USER CLICKED CONTINUE */
              if(data.action == 'continue'){
                if(data.notes){
                  this.goNext(StudyNotesPage , { photo: data.photo});
                }
                else if(data.photo)  
                  this.goNext(StudyPhotoPage , 'studyPhotoPage' );
              }
              /* IF USER CLICKED END */
              else{
                if(this.timer.hasFinished() || this.timer.getRemainingTime() <= 0)
                  this.goToStudyItemsPage();
                else
                  this.startNextObservation();
              }
      });

    modal.present();
  }

  startNextObservation(){
    if(this.navCtrl.length() <= 12){
      this.parseData.setDataArray(this.parseData.getData()); 
      this.parseData.clearData();
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 3))); 
    }  
    else
      this.navCtrl.popToRoot(); 
  }

  /* GOING TO THE NEXT PAGE */
  goNext(component , data) {
    this.navCtrl.push(component , data);
  }

  goToStudyItemsPage(){
    this.parseData.setDataArray(this.parseData.getData()); 
    this.parser.getRounds().setRoundData(this.parseData.getDataArray());
    this.parser.getRounds().setRoundEndTime(new Date().getTime())
    this.parser.setRounds(this.parser.getRounds());
    this.parser.geAllData().setRoundData(this.parser.getRounds());
    this.parser.geAllData().setStudyEndTime(new Date().getTime());
    /* CLEARING STUDY DATA OBJECT AND ARRAY FOR NEXT ENTRIES AND NEXT ROUND*/
    this.parseData.clearDataArray();
    this.parseData.clearData();
    this.parser.clearRounds();
    this.goNext(StudyItemsPage , 'studyItemsPage' );
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

