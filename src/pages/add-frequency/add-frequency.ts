import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Time , OperationsProvider  , ToastProvider,  ParseDataProvider } from '../../providers';
import { StudyPhotoPage } from '../study-photo/study-photo';
import { StudyNotesPage } from '../study-notes/study-notes';
import { Data } from '../../models';
import { RatingsPage } from '../ratings/ratings';
import { Actions } from '../../bases/actions';
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
  public elements: Array<any> = [];
  public nextElement: any;

  constructor(public navCtrl: NavController, 
               public navParams: NavParams , 
               public time: Time,
               public operations: OperationsProvider,
               public modalCtrl: ModalController,
               public parseData: ParseDataProvider,
               public toast: ToastProvider) {
    //super(navCtrl,navParams,parseData,time);            
    // this.init(this.parseData.getData(), 'frequencyPage');             
    this.init();
   }
   
   ionViewDidLoad() {     
     console.log('SelectElementPage');
   }

   ionViewWillEnter(){
    this.frequency = '';
    this.numbers = [0, 1 , 2 , 3 , 4 , 5 , 6 , 7, 8 , 9];
    this.elements = this.navParams.get("elements");
    this.setNextElement();
   }

  init(){
    this.frequency = '';
    this.numbers = [0, 1 , 2 , 3 , 4 , 5 , 6 , 7, 8 , 9];
    this.elements = this.navParams.get("elements");
    this.setNextElement();
  }

  setNextElement(){
    let element = this.parseData.getData().getElement();
    let index  = this.elements.indexOf(element);
    if(index == this.elements.length - 1)
      this.nextElement = null;
    else
      this.nextElement = this.elements[index + 1];
  }
  
  /* CONCATINATING FREQUENCY WITH THE PREVIOUS ONE*/
  concatFrequency(num){
    this.frequency = this.frequency + num;
    this.parseData.setFrequency(this.frequency);
  } 


  /* REMOVING ENTERED FREQUENCY */ 
  removeFrequency(){
    this.frequency = this.frequency.slice(0, this.frequency.length -1);
    this.parseData.setFrequency(this.frequency);
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

  go(value: string): void {

    this.parsingData();
    
    /* STOPPING TIMER  */
    this.time.stopTimer();

    /* IF USER SELECTS THE NEXT ELEMENT */
    if(value == 'nextElement'){
      this.time.isNext = true;
      this.frequency = '';

      this.setTask();
      
      let data = this.parseData.getData();
      data.setElement(this.nextElement);
      
      /* IF ELEMENT's RATING IS NOT RATED OR IF ELEMENT's RATING IS 100 */
      let rating = this.nextElement.rating;
      if(rating == 1 || rating == 2){
        if(rating == 1)
          data.setRating('Not Rated');
        else
            data.setRating(100);
        this.parseData.setData(data);         
        this.setNextElement();
      }
      else{
        /* IF RATINGS PAGE IS NOT IN THE STACK */
        if(this.navCtrl.length() == 8){
          let index = this.navCtrl.length() - 1;
          this.navCtrl.insert(index, RatingsPage);
        }
        /* IF NEXT ELEMENT's FREQUENCY IS DISABLED, SETTING IT TO ONE */
        if(this.nextElement.count == 2)
          data.setFrequency(1);

        this.parseData.setData(data);
        this.parseData.setElements(this.elements);
        this.navCtrl.pop();
      }

    }
    /* IF USER SELECT TO GO TO ELEMENTS' LIST */
    else if(value == 'elements'){
      this.setTask();
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 6)));
    }
    /* IF USER GO TO GO TO TASKS PAGE */
    else if(value == 'tasks')
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 5)));
  }

  /* PARSING STUDY DATA */
  parsingData(){
    let data = this.parseData.getData();
    data.setTime(this.time.ticks * 1000);
    /* IF USER HAS NOT ENTERED FREQUENCY, SETTING IT TO 0 */
    if(this.parseData.getFrequency() == 0 || this.parseData.getFrequency() == null)
      this.parseData.setFrequency(0);

    data.setFrequency(this.parseData.getFrequency());
    /* IF NO NOTES ADDED FOR THIS OBSERVATION */
    if(!data.getNotes())
      data.setNotes(null);
    /* IF NO PHOTO ADDED FOR THIS OBSERVATION */
    if(!data.getPhoto())
      data.setPhoto(null);

    let duration = new Date().getTime() - data.getstartTime();
    data.setduration(duration);
    data.setendTime(new Date().getTime());
    this.parseData.setData(data);

    this.parseData.setDataArray(this.parseData.getData());

    this.parseData.clearData();
  }

  /* SETTING PREVIOUSLY SELECTED TASK FOR THE NEW ELEMENT'S STUDY */
  setTask(){
    let data = new Data();
    /* GETTING LAST INDEX OF ARRAY AND TASK OF SETTING THE TASK FOR NEXT ELEMENT'S STUDY */
    let lastIndex = this.parseData.getDataArray().length - 1;
    data.setTask(this.parseData.getDataArray()[lastIndex].getTask());
    data.setStartTime(new Date().getTime());
    this.parseData.setData(data);
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


  