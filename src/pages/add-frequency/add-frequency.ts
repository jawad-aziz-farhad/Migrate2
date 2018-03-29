import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Time , OperationsProvider  , ToastProvider,  ParseDataProvider , ParserProvider } from '../../providers';
import { StudyPhotoPage } from '../study-photo/study-photo';
import { StudyNotesPage } from '../study-notes/study-notes';
import { StudyItemsPage } from '../study-items/study-items';

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

  init(){
    this.frequency = '';
    this.numbers = [0, 1 , 2 , 3 , 4 , 5 , 6 , 7, 8 , 9];
  }
  
  /* CONCATINATING FREQUENCY WITH THE PREVIOUS ONE*/
  concatFrequency(num){
    this.frequency = this.frequency + num;
  } 

  /* REMOVING ENTERED FREQUENCY */ 
  removeFrequency(){
    this.frequency = this.frequency.slice(0, this.frequency.length -1 );
  }

  millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    if(minutes > 0)
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
    else
      return '00:' +(parseInt(seconds) < 10 ? '0' : '') + seconds;
  }
   

  /* WHEN USER CANCEL THE STUDY WE WILL KILL TIMER AND NAVIGATE USER TO ROOT PAGE */
  onCancelStudy(event){
    if(event){
      this.time.destroyTimer();
      this.navCtrl.popToRoot();
    }
  }

  /* ENDING OBSERVATION OR ROUND BY CHECKING THE TIME STATUS */
  endStudy(){    
    let observationTime  = new Date().getTime() - this.parseData.getData().getObservationTime();
    let observation_Time = this.millisToMinutesAndSeconds(observationTime);
    this.parseData.getData().setObservationTime(observation_Time);

    let notes = this.parseData.getData().getNotes();
    let photo = this.parseData.getData().getPhoto();

    if(!notes)
      this.parseData.getData().setNotes(null);
    if(!photo)  
      this.parseData.getData().setPhoto(null);
   
    if(!this.frequency)
      this.frequency = "0";  
      
    this.parseData.getData().setFrequency(this.frequency);
    this.parseData.setData(this.parseData.getData());

    /* IF TIME IS UP AND USER HAS ENDED UP THE STUDY, 
        PARSING DATA AND GOING TO STUDY ITEMS PAGE 
    */
    if(this.time.isStudyEnded){

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
      this.navCtrl.push(StudyItemsPage);
    }
    /* STARTING NEXT OBSERVATION */
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

  /* ADDING NOTES FOR THE CURRENT OBSERVATION */
  addNotes(){
    this.navCtrl.push(StudyNotesPage);
  }

  /* ADDING PHOTO FOR THE CURRENT OBSERVATION */
  addPhoto(){
    this.navCtrl.push(StudyPhotoPage);
  }
}

