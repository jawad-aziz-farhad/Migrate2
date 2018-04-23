import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnterRatingPage} from '../enter-rating/enter-rating';
import { AddFrequencyPage} from '../add-frequency/add-frequency';
import { Time , OperationsProvider , ParseDataProvider } from '../../providers';
import { Data } from '../../models';
import { ActionButtons } from '../actionbuttons/actionbuttons';
import { Actions } from '../../bases/actions';
import { StudyNotesPage } from '../study-notes/study-notes';
import { StudyPhotoPage } from '../study-photo/study-photo';
/**
 * Generated class for the RatingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ratings',
  templateUrl: 'ratings.html',
})
export class RatingsPage {

  public roundTime: number; 
  public ratings: any;
  public temp: any;
  public element: any;
  private nextElement: any;
  private elements: Array<any> = [];
  private _isElementDisabled: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams , 
              public parseData: ParseDataProvider,
              public time: Time) {   
   // super(navCtrl, navParams, parseData, time);            
  }


  ionViewDidLoad() {       
    console.log('SelectElementPage');
  }

  ionViewWillEnter() {
    this.initView()
  }

  /* iNITIALIZING VIEW  */
  initView(){
    if(!this.time.isTimerRunning && !this.time.isNext)
    this.time.runTimer(); 
    this.ratings = [ 40 , 50 , 55 , 60 , 65, 70 , 75 , 80 , 85 , 90 , 95 , 100 , 105 , 110 , 115 , 120 , 125 , 130 , 135 , 'Not Rated' ];
    this.temp = this.ratings[0];
    this.isElementDisabled();  
  }
  
  selectRating(rating){
    this.temp = rating;
    /* IF ELEMENT IS NOT DISABLED, GOING TO THE FREQUENCY PAGE */
    if(!this._isElementDisabled){
      this._parseData(rating);
      this.gotoNextPage(AddFrequencyPage);
    }
    else
      this._parseData(rating);
  }

  /* PARSING ROUND DATA TO NEXT PAGE */
  _parseData(rating: number) { 
    this.parseData.setRating(rating);   
    this.parseData.getData().setRating(rating);
    this.parseData.setData(this.parseData.getData());
  }

  /* GOING TO NEXT PAGE */
  gotoNextPage(page: any){
    let data = this.navParams.get("elements");
    if(!data)
      data = this.parseData.getElements();
    this.navCtrl.push(page, { elements: data});
  }

  /* SETTING STYLE TO THE SELECTED ITEM */
  getStyle(rating){
    if(this.temp == rating)
      return 'active';
    else
      return 'disabled';  
  }

  /* WHEN USER CANCEL THE STUDY WE WILL KILL TIMER AND NAVIGATE USER TO ROOT PAGE */
  onCancelStudy(event){
    if(event)
    {
      this.time.destroyTimer();
      this.navCtrl.popToRoot();
    }
  }

  isElementDisabled() {
    let data = this.parseData.getData();
    if(data && data.getElement().count == 2){
      this._isElementDisabled = true;
    }
    else
      this._isElementDisabled = false;  
  }

  getNextElement() {
    let nextElement = null;
    let elements = this.navParams.get('elements');
    let element  = this.parseData.getData().getElement();
    let index    = elements.indexOf(element);
    if(index == elements.length - 1)
      nextElement = null;
    else
      nextElement = elements[index + 1];

    return nextElement;
  }

  /*GOING TO THE PAGE BASED ON THE PASSED VALUE TO FUNCTION */
  go(value: string): void {
    
    this.parsingData();
    
    /* STOPPING TIMER  */
    this.time.stopTimer();

    /* IF USER SELECTS THE NEXT ELEMENT */
    if(value == 'nextElement') {

      this.time.isNext = true;
      
      this.setTask();      
      let data = this.parseData.getData();
      data.setElement(this.nextElement);
      /* IF ELEMENT's RATING IS NOT RATED OR IF ELEMENT's RATING IS 100 */
      let rating = this.nextElement.rating;
      let count  = this.nextElement.count;

      /* IF NEXT ELEMENT's COUNT IS EQUAL TO 2 AND RATING IS 1 OR 2, GOING TO ACTIONBUTTONS PAGE */
      if(rating == 1 || rating == 2){
        if(rating == 1)
          data.setRating('Not Rated');
        else
            data.setRating(100);
        this.parseData.setData(data);

        if(count == 2)       
          this.navCtrl.push(ActionButtons);
        else
          this.navCtrl.push(AddFrequencyPage);  
      }
      /* STAYING ON THIS PAGE */
      else
      { 
        this.temp = this.ratings[0];
        this.parseData.setData(data);
        this.isElementDisabled();
      }
    }
    /* IF USER SELECT TO GO TO ELEMENTS' LIST */
    else if(value == 'elements'){
      this.setTask();
      this.navCtrl.pop();
    }
    /* IF USER GO TO GO TO TASKS PAGE */
    else if(value == 'tasks')
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 5)));
  }

  /* PARSING STUDY DATA */
  parsingData(){
    let data = this.parseData.getData();
    data.setRating(this.temp);
    data.setTime(this.time.ticks * 1000);
    data.setFrequency(1);
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
    console.log("DATA CLEARED.");
  }

  /* SETTING NEXT ELEMENT */
  setNextElement(){
    let element = this.parseData.getData().getElement();
    let index  = this.elements.indexOf(element);
    if(index == this.elements.length - 1)
      this.nextElement = null;
    else
      this.nextElement = this.elements[index + 1];
      
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
