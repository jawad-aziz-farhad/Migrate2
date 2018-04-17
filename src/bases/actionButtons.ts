import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParseDataProvider, Time } from '../providers';
import { Data } from '../models';
import { AddFrequencyPage } from '../pages/add-frequency/add-frequency';
import { ActionButtons } from '../pages/actionbuttons/actionbuttons';
import { RatingsPage } from '../pages/ratings/ratings';

export class Action_Buttons {

    protected data: any;
    protected elements: Array<any> [];
    protected nextElement: any;
    protected currentPage: string;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public parseData: ParseDataProvider,
                public time: Time) {
    }

    init(data: any, currentPage : string){
      this.data = data;
      this.currentPage = currentPage;
    }

    isElementDisabled(){
        if(this.data.getElement().count == 2)
            return true;
        else
            return false;  
    }
    
    getNextElement() {
        this.nextElement = null;
        let elements = this.navParams.get('elements');
        let element  = this.data.getElement();
        let index    = elements.indexOf(element);
        if(index == elements.length - 1)
        this.nextElement = null;
        else
        this.nextElement = elements[index + 1];
    
        return this.nextElement;
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
          if(rating == 1 || rating == 2) {
            if(rating == 1)
            data.setRating('Not Rated');
            else
            data.setRating(100);
            this.parseData.setData(data);

            /* IF WE ARE ON THE ACTION-BUTTONS PAGE */
             if(this.currentPage == 'actionButtons') {
                /* IF NEXT ELEMENT IS NOT DISABLED, MOVING TO FREQUENCY PAGE AND REMOVING CURRENT PAGE FROM NAVIGATION STACK */  
                if(count == 1)       
                this.navCtrl.push(AddFrequencyPage).then(() => {
                  this.navCtrl.remove(this.navCtrl.getPrevious().index);
                }).catch(error => console.error(error));
                
                else
                  console.log("STAYING ON ACTION BUTTONS PAGE.");
              }
              /* IF WE ARE ON THE AddFrequency PAGE */
              else if(this.currentPage == 'frequencyPage'){
                /* IF NEXT ELEMENT IS FREQUENCY IS ALSO DISABLED, LEAVING FREQUENCY PAGE*/  
                if(count == 2)
                  this.navCtrl.push(ActionButtons).then(() => {
                    this.navCtrl.remove(this.navCtrl.getPrevious().index);
                  })
                  .catch(error => console.error(error));
                else
                  this.setNextElement();
              }

              /* IF WE ARE ON THE Ratings PAGE */
              else if(this.currentPage = 'ratingsPage'){
                if(count == 2)       
                  this.navCtrl.push(ActionButtons);
                else
                  this.navCtrl.push(AddFrequencyPage);
              }
            }

            /* IF ELEMENT's RATING IS 3 (FIELD USER's INPUT) */
            else {
                /* IF WE ARE ON THE ActionButtons PAGE OR ON THE AddFrequency Page*/
                if(this.currentPage == 'actionButtons' || this.currentPage == 'frequencyPage') {
                    /* IF RATINGS PAGE IS NOT IN THE STACK */
                    if(this.navCtrl.length() == 8){
                        let index = this.navCtrl.length() - 1;
                        this.navCtrl.insert(index, RatingsPage);
                    }
                    
                    this.parseData.setData(data);
                    this.parseData.setElements(this.elements);
                    this.navCtrl.pop();
                }
                /* IF WE ARE ON THE Ratings PAGE */
                else if(this.currentPage == 'ratingsPage'){
                   this.parseData.setData(data);
                }
            }
            
        }

        /* IF USER SELECT TO GO TO ELEMENTS' LIST */
        else if(value == 'elements') {
          this.setTask();
            /* IF WE ARE ON THE ActionButtons PAGE OR ON THE AddFrequency Page*/
           if(this.currentPage == 'actionButtons' || this.currentPage == 'frequencyPage') 
              this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 6)));
           /*  IF WE ARE ON THE Ratings PAGE */  
           else if(this.currentPage == 'ratingsPage')
            this.navCtrl.pop(); 
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

        this.parseData.setData(data);
        data = this.parseData.getData();
        this.parseData.setDataArray(this.parseData.getData());

        this.parseData.clearData();
    }

    /* SETTING PREVIOUSLY SELECTED TASK FOR THE NEW ELEMENT'S STUDY */
    setTask(){
        let data = new Data();
        data.setTask(this.parseData.getData().getTask());
        this.parseData.setData(data);
    }
    
}