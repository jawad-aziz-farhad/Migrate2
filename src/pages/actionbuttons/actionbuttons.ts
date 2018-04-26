import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParseDataProvider , Time } from '../../providers';
import { AddFrequencyPage } from '../add-frequency/add-frequency';
import { Data } from '../../models';
import { Actions } from '../../bases/actions';
import { RatingsPage } from '../ratings/ratings';
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
    this.init();            
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActionbuttonsPage');
  }

  init(){
    this.data = this.parseData.getData();
    this.elements = this.parseData.getElements();
    this.setNextElement();
  }

  isElementDisabled(){
    if(this.data.getElement().count == 2)
      return true;
    else
      return false;  
  }

  getNextElement() {
    return this.nextElement;
  }

  /*GOING TO THE PAGE BASED ON THE PASSED VALUE TO FUNCTION */
  go(value: string): void {
    
    this.parsingData();
    
    /* STOPPING TIMER  */
    this.time.stopTimer();

    this.time.isNext = true; 

    /* IF USER SELECTS THE NEXT ELEMENT */
    if(value == 'nextElement') {

      // this.time.isNext = true;      
      this.setTask();
      
      let data = this.parseData.getData();
      data.setElement(this.nextElement);
      
      /* IF ELEMENT's RATING IS NOT RATED OR IF ELEMENT's RATING IS 100 */
      let rating = this.nextElement.rating;
      let count  = this.nextElement.count;

      /* IF NEXT ELEMENT's RATING IS 1 OR 2 */
      if(rating == 1 || rating == 2) {
        if(rating == 1)
          data.setRating('Not Rated');
        else
          data.setRating(100);
        /* IF NEXT ELEMENT IS NOT DISABLED, MOVING TO FREQUENCY PAGE AND REMOVING CURRENT PAGE FROM NAVIGATION STACK */  
        if(count == 1)       
          this.navCtrl.push(AddFrequencyPage).then(() => {
            this.navCtrl.remove(this.navCtrl.getPrevious().index);
        }).catch(error => console.error(error)); 
        /* IF NEXT ELEMENT's COUNT IS 2(DISABLED), SETTING IT TO 1 */
        else
          data.setFrequency(1);  

        this.parseData.setData(data);
        this.setNextElement();
      }

      /* IF NEXT ELMENT's RATING IS 3 */
      else{
        /* IF RATINGS PAGE IS NOT IN THE STACK */
        if(this.navCtrl.length() == 8){
          let index = this.navCtrl.length() - 1;
          this.navCtrl.insert(index, RatingsPage);
        }

        this.parseData.setData(data);
        this.navCtrl.pop();
      }
        
    }
    /* IF USER SELECT TO GO TO ELEMENTS' LIST */
    else if(value == 'elements') {
      this.setTask();
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 5)));
    }
    /* IF USER GO TO GO TO TASKS PAGE */
    else if(value == 'tasks')
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 4)));
    
  }

  /* SETTING NEXT ELEMENT */
  setNextElement() {
    let element = this.data.getElement();
    let index  = this.elements.indexOf(element);
    if(index == this.elements.length - 1)
      this.nextElement = null;
    else
      this.nextElement = this.elements[index + 1];
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
    /* GETTING LAST INDEX OF ARRAY AND TASK OF SETTING THE TASK FOR NEXT ELEMENT'S STUDY */
    let lastIndex = this.parseData.getDataArray().length - 1;
    let data = new Data();
    data.setTask(this.parseData.getDataArray()[lastIndex].getTask());
    data.setStartTime(new Date().getTime());
    this.parseData.setData(data);
  }

}
