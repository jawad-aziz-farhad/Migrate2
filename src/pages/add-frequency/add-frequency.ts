import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Time , OperationsProvider  , ToastProvider,  ParseDataProvider , ParserProvider } from '../../providers';
import { StudyPhotoPage } from '../study-photo/study-photo';
import { StudyNotesPage } from '../study-notes/study-notes';
import { StudyItemsPage } from '../study-items/study-items';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { SelectRolePage } from '../select-role/select-role';
import { Rounds } from '../../models/index';
import { FREQUENCY_INPUT_ERROR } from '../../config/config';
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

  public roundTime: number = 0;
  public numbers: Array<number>;
  public frequency: any;

  constructor(public navCtrl: NavController, 
               public navParams: NavParams , 
               public time: Time,
               public operations: OperationsProvider,
               public modalCtrl: ModalController,
               public parseData: ParseDataProvider,
               public toast: ToastProvider,
               public parser: ParserProvider) {
    this.init();
   }
   
   ionViewDidLoad() {     
     console.log('SelectElementPage');
   }

  ionViewWillEnter() {
  }

  init(){
    this.frequency = '';
    this.numbers = [0, 1 , 2 , 3 , 4 , 5 , 6 , 7, 8 , 9];
  }
  
  /* CONCATINATING FREQUENCY WITH THE PREVIOUS ONE*/
  concatFrequency(num){
     if(this.frequency.length == 0 && num == 0)
      console.log(FREQUENCY_INPUT_ERROR);
    else  
      this.frequency = this.frequency + num;
  } 

  /* REMOVING ENTERED FREQUENCY */ 
  removeFrequency(){
    const length = this.frequency.length - 1;
    this.frequency = this.frequency.slice(0, this.frequency.length -1 );
  }

  /* ADDING FREQUENCY TO THE ROUND DATA AND MOVING TO NEXT PAGE */
  addFrequency(){
    console.log('FREQUENCY IS: ' + this.frequency);
    this.openModal();
  }

  /* PARSING DATA */
  _parseData(frequency: number) {

    let observationTime  = new Date().getTime() - this.parseData.getData().getObservationTime();
    let observation_Time = this.millisToMinutesAndSeconds(observationTime);
    this.parseData.getData().setObservationTime(observation_Time);
    this.parseData.getData().setNotes(null);
    this.parseData.getData().setPhoto(null);
    this.parseData.getData().setFrequency(frequency);
    this.parseData.setData(this.parseData.getData());
  } 

  millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    if(minutes > 0)
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
    else
      return '00:' +(parseInt(seconds) < 10 ? '0' : '') + seconds;
  }
   
  /* OPENING MODAL FOR ADDING FREQUENCY */
  openModal() {
      let modal = this.modalCtrl.create('StudyOptionsPage', null, { cssClass: 'inset-modal study-options-modal' });        
      modal.onDidDismiss(data => {

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
                if(this.time.ticks <= 0)
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
      this.time.destroyTimer();
      this.navCtrl.popToRoot();
    }
  }


  endStudy(){
    
    let observationTime  = new Date().getTime() - this.parseData.getData().getObservationTime();
    let observation_Time = this.millisToMinutesAndSeconds(observationTime);
    this.parseData.getData().setObservationTime(observation_Time);
    let notes = this.parseData.getData().getNotes();
    let photo = this.parseData.getData().getPhoto();

    if(!notes)
      this.parseData.getData().setNotes(null);
    if(!
      photo)  
      this.parseData.getData().setPhoto(null);

    this.parseData.getData().setFrequency(this.frequency);
    this.parseData.setData(this.parseData.getData());

    if(this.time.ticks <= 0){
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
      
    else{

      if(this.navCtrl.length() <= 12){
        this.parseData.setDataArray(this.parseData.getData()); 
        this.parseData.clearData();
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 3)));
      }  
      else
        this.navCtrl.popToRoot(); 
    }
  }

  addNotes(){
    this.navCtrl.push(StudyNotesPage);
  }

  addPhoto(){
    this.navCtrl.push(StudyPhotoPage);
  }

}

