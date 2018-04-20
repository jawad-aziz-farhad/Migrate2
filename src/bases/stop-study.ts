import {  NavController } from 'ionic-angular';
import { STUDY_CANCELING_MESSAGE, ALERT_TITLE, STUDY_END_MESSAGE } from '../config/config';
import { Time , AlertProvider, ParseDataProvider } from '../providers';
import { StudyItemsPage } from '../pages/study-items/study-items';

 export class Stop {

    private ticks: number = 0;

    constructor(private navCtrl: NavController,
                private alert: AlertProvider,
                private parse: ParseDataProvider,
                private time: Time){}
    
    /* ASKING FOR STUDY CONFIRMATION FROM USER, IF USER SAYS YES, 
      * ENDING STUDY, STOPPING TIMER 
      * AND NAVIGATING BACK TO ROOT PAGE
    */            
    studyEndConfirmation() {
        this.alert.presentConfirm(ALERT_TITLE , STUDY_END_MESSAGE).then(action => {
          if(action == 'yes'){              
            this.ticks = this.time.ticks;
            this.time.destroyTimer();
            /* IF DATA IS RECORDED, MOVING USER TO STUDY ITEMS PAGE */
            if(this.parse.getDataArray().length > 0) {
              this.parseData();
              this.clearStudyData();
              this.navCtrl.push(StudyItemsPage);
            }
            /* IF NO DATA RECORDED YET, MOVING USER TO THE ROOT PAGE (PROJECTS) */
            else
              this.navCtrl.popToRoot();
          }
          else
              console.log('User dont want to cancel the Study');  
        })
        .catch(error => console.log("ERROR: " + error));
    }

  parseData(){
        let data = this.parse.getData();
        if(data.getTask() && data.getElement()){
           data.setTime(this.ticks * 1000);
           
           /* IF ELEMENT's RATING IS 3(FILED USER's INPUT) */
           if(data.getElement().rating == 3){
            /* IF USER HAS NOT ENTERED RATING, SETTING IT TO 0 */
            if(this.parse.getRating() == 0 || this.parse.getRating() == null)
              this.parse.setRating(0);
            /* SETTING RATING */
              data.setRating(this.parse.getRating());
          }
          /* IF ELEMENT's RATING IS 1 or 2 */
          else{
            if(data.getElement().rating == 1)
              data.setRating('Not Rated');
            else if(data.getElement().rating == 2)
              data.setRating(100);  
          }

          if(data.getElement().count == 1){
            /* IF USER HAS NOT ENTERED FREQUENCY, SETTING IT TO 0 */
            if(this.parse.getFrequency() == 0 || this.parse.getFrequency() == null)
              this.parse.setFrequency(0);
            /* SETTING FREQUENCY */
            data.setFrequency(this.parse.getFrequency());
          }
          else
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
          this.parse.setData(data);
          
          this.parse.setDataArray(this.parse.getData());
        }

        /* SETTING ALL STUDY DATA */
        this.parse.getStudyData().setStudyEndTime(new Date().getTime());
        this.parse.getStudyData().setData(this.parse.getDataArray());
        this.parse.setStudyData(this.parse.getStudyData());
    }

  endStudy() {
      this.alert.presentConfirm(ALERT_TITLE , STUDY_CANCELING_MESSAGE).then(action => {
        if(action == 'yes'){              
          this.time.destroyTimer();
          this.clearStudyData();
          this.parse.clearStudyData();
          this.navCtrl.popToRoot();
        }
        else
          console.log("DISMISSING DIALOG.");
      });
    }

   /* CLEARING PARSER DATA */ 
   clearStudyData(){
    this.parse.clearData();
    this.parse.clearDataArray();
   } 
}