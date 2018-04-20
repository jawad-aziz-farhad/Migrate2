import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParseDataProvider , Time } from '../../providers';
import { AddFrequencyPage } from '../add-frequency/add-frequency';
import { Data } from '../../models';
import { Actions } from '../../bases/actions';
/**
 * Generated class for the ActionbuttonsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-actionbuttons',
  templateUrl: 'actionbuttons.html',
})
export class ActionButtons  {

  public elements: Array<any> = [];
  public nextElement: any;
  public data: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public parseData: ParseDataProvider,
              public time: Time) {
     //super(navCtrl,navParams,parseData,time);            
     //this.init(this.parseData.getData(), 'actionButtons');
    this.init();            
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActionbuttonsPage');
  }

  init(){
    this.data = this.parseData.getData();
  }

  isElementDisabled(){
    if(this.data.getElement().count == 2)
      return true;
    else
      return false;  
  }

  getNextElement() {
    let nextElement = null;
    let elements = this.navParams.get('elements');
    let element  = this.data.getElement();
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
      
      let data = this.data;
      data.setElement(this.nextElement);
      
      /* IF ELEMENT's RATING IS NOT RATED OR IF ELEMENT's RATING IS 100 */
      let rating = this.nextElement.rating;
      let count  = this.nextElement.count;

      /* IF NEXT ELEMENT's COUNT IS EQUAL TO 2 AND RATING IS 1 OR 2 */
      if(rating == 1 || rating == 2){
        if(rating == 1)
          data.setRating('Not Rated');
        else
            data.setRating(100);
        /* IF NEXT ELEMENT IS NOT DISABLED, MOVING TO FREQUENCY PAGE AND REMOVING CURRENT PAGE FROM NAVIGATION STACK */  
        if(count == 1)       
          this.navCtrl.push(AddFrequencyPage).then(() => {
            this.navCtrl.remove(this.navCtrl.getPrevious().index);
          }).catch(error => console.error(error));  
        }
        /* IF NEXT ELEMENT's COUNT IS 2(DISABLED), SETTING IT TO 1 */
        else
          data.setFrequency(1);

        this.parseData.setData(data);   
    }
    /* IF USER SELECT TO GO TO ELEMENTS' LIST */
    else if(value == 'elements') {
      this.setTask();
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 6)));
    }
    /* IF USER GO TO GO TO TASKS PAGE */
    else if(value == 'tasks')
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 5)));
    
  }

  /* SETTING NEXT ELEMENT */
  setNextElement(){
    let element = this.data.getElement();
    let index  = this.elements.indexOf(element);
    if(index == this.elements.length - 1)
      this.nextElement = null;
    else
      this.nextElement = this.elements[index + 1];
    console.log("LAST INDEX IS: "+ index + "\n NEXT ELEMENT IS: "+ JSON.stringify(this.nextElement));
  }

  /* PARSING STUDY DATA */
  parsingData(){
    let data = this.parseData.getData();
    data.setTime(this.time.ticks * 1000);
    
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
    data = this.parseData.getData();
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




}
